package com.softcommerce.views.uiformimportaranexo;


import com.softcommerce.formularios.importar.*;
import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanAnexo;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.tablas.ImpAnexoTableModel;
import com.softcommerce.reglasnegocio.RnCliente;
import com.softcommerce.util.ExceptionHandler;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.HeadlessException;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.table.TableRowSorter;
import jxl.Sheet;
import jxl.Workbook;
import jxl.WorkbookSettings;
import jxl.read.biff.BiffException;
import org.jdesktop.swingx.HorizontalLayout;
import java.net.URL;
import java.sql.SQLException;
import org.apache.log4j.Logger;

public class UiFormImportarAnexo extends JDialog
        implements InterUiFormImportarAnexo, ListSelectionListener, ActionListener, FocusListener, KeyListener {

    private final URL path;
    private final Usuario usuario;
    private JComboBox cboTipo;
    private JButton btnImportar;
    static JFileChooser jChooser;
    public CTable table;
    public ImpAnexoTableModel modeltable;
    public TableRowSorter modeloOrdenado;
    private JScrollPane scrollTable;
    private JButton btnGuardar;
    private final Logger logger = Logger.getLogger(UiFormImportarAnexo.class);

    public UiFormImportarAnexo(JFrame frame, Usuario usuario, java.net.URL ruta) {
        super(frame, true);
        this.usuario = usuario;
        this.path = ruta;
        initComponents();
    }

    private void initComponents() {
        modeltable = new ImpAnexoTableModel();
        modeloOrdenado = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        table.getSelectionModel().addListSelectionListener(this);
        scrollTable = new JScrollPane(table);
        scrollTable.setPreferredSize(new Dimension(800, 450));
        getContentPane().add(scrollTable, BorderLayout.CENTER);
        JPanel pnlOpciones = new JPanel();
        btnGuardar = new JButton("Guardar");
        btnGuardar.addActionListener(this);
        pnlOpciones.add(btnGuardar);
        getContentPane().add(pnlOpciones, BorderLayout.SOUTH);

        JPanel pnlCabecera = new JPanel();
        pnlCabecera.setLayout(new HorizontalLayout(10));
        JLabel lblTipo = new JLabel("Tipo: ");
        pnlCabecera.add(lblTipo);
        cboTipo = new JComboBox();
        cboTipo.addActionListener(this);
        cboTipo.addItem("Proveedores");
        cboTipo.addItem("Clientes");
        pnlCabecera.add(cboTipo);
        btnImportar = new JButton("Importar");
        btnImportar.addActionListener(this);
        pnlCabecera.add(btnImportar);
        getContentPane().add(pnlCabecera, BorderLayout.PAGE_START);

        pack();

        jChooser = new JFileChooser();
    }

    private void importarExcel() {
        try {
            jChooser.showOpenDialog(null);
            File file = jChooser.getSelectedFile();
            if (file == null) {
                return;
            }
            if (!file.getName().endsWith("xls")) {
                JOptionPane.showMessageDialog(null, "Seleccione Excel solo con extension .xls", "Error", JOptionPane.ERROR_MESSAGE);
            } else {
                fillData(file);
                modeltable.fireTableDataChanged();
                table.setAllColumnPreferredWidth();
            }
        } catch (HeadlessException | ParseException e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void fillData(File file) throws ParseException {
        Workbook workbook = null;
        try {
            try {
                WorkbookSettings ws = new WorkbookSettings();
                ws.setEncoding("Cp1252");
                workbook = Workbook.getWorkbook(file, ws);
            } catch (IOException ex) {
                ExceptionHandler.handleException(ex, logger);
            }
            Sheet sheet = workbook.getSheet(0);
            if (sheet.getColumns() != 6) {
                JOptionPane.showMessageDialog(this, "Numero de Columnas: " + modeltable.getColumnCount());
                return;
            }
            System.out.println("Cols:" + sheet.getColumns());
            System.out.println("Rows:" + sheet.getRows());
            modeltable.clearTable();
            String descripcion;
            String tipo;
            for (int j = 1; j < sheet.getRows(); j++) {
                BeanAnexo beanAnexo = new BeanAnexo();
                beanAnexo.setNumero(sheet.getCell(0, j).getContents().trim());
                beanAnexo.setPaterno(sheet.getCell(1, j).getContents());
                beanAnexo.setMaterno(sheet.getCell(2, j).getContents());
                beanAnexo.setNombre(sheet.getCell(3, j).getContents());
                descripcion = sheet.getCell(4, j).getContents();
                if (descripcion.trim().length() == 0) {
                    descripcion = beanAnexo.getPaterno() + " " + beanAnexo.getMaterno() + " " + beanAnexo.getNombre();
                }
                if (beanAnexo.getNumero().trim().length() == 8) {
                    tipo = "N";
                } else if (beanAnexo.getNumero().trim().length() == 11) {
                    if (beanAnexo.getNumero().trim().substring(0, 1).equals("1")) {
                        tipo = "N";
                    } else {
                        tipo = "J";
                    }
                } else {
                    tipo = "";
                }
                beanAnexo.setFlagTipoPersona(tipo);
                beanAnexo.setDescripcion(descripcion);
                beanAnexo.setDireccion(sheet.getCell(5, j).getContents());
                modeltable.setBeanAnexo(beanAnexo);
            }
            modeltable.fireTableDataChanged();
            table.setAllColumnPreferredWidth();
        } catch (BiffException e) {
            ExceptionHandler.handleException(e, logger);
        }
    }

    private void guardarAsiento() {
        try {
            if (verificarDatos()) {
                String id_tipo_anexo = cboTipo.getSelectedIndex() == 0 ? "1" : "2";
                guardarAnexo(id_tipo_anexo);
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    private void guardarAnexo(String id_tipo_anexo) throws Exception {
        try {
            RnCliente logicCliente = new RnCliente(path);
            String xmlAnexo;
            xmlAnexo = "<?xml version=\"1.0\" ?> ";
            xmlAnexo += "<ANEXOS>";
            for (int i = 0; i < modeltable.getRowCount(); i++) {
                BeanAnexo beanAnexo = modeltable.getBeanAnexo(i);
                xmlAnexo += "<ANEXO>";
                xmlAnexo += "<TIPO>" + beanAnexo.getFlagTipoPersona() + "</TIPO>";
                xmlAnexo += "<TD>" + (beanAnexo.getNumero().trim().length() == 8 ? "01" : "05") + "</TD>";
                xmlAnexo += "<NUMERO>" + beanAnexo.getNumero() + "</NUMERO>";
                xmlAnexo += "<PATERNO>" + beanAnexo.getPaterno() + "</PATERNO>";
                xmlAnexo += "<MATERNO>" + beanAnexo.getMaterno() + "</MATERNO>";
                xmlAnexo += "<NOMBRE>" + beanAnexo.getNombre() + "</NOMBRE>";
                xmlAnexo += "<DESCRIPCION>" + beanAnexo.getDescripcion() + "</DESCRIPCION>";
                xmlAnexo += "<DIRECCION>" + beanAnexo.getDireccion() + "</DIRECCION>";
                xmlAnexo += "</ANEXO>";
            }
            xmlAnexo += "</ANEXOS>";
            logger.info("xml_Anexo: " + xmlAnexo);
            xmlAnexo = xmlAnexo.replace("&", " ");
            String rpta;
            rpta = logicCliente.importarAnexo(id_tipo_anexo, usuario.getId_usuario(), xmlAnexo);
            if (rpta.trim().equals("CORRECTO")) {
                JOptionPane.showMessageDialog(this, "REGISTRADO CORRECTAMENTE");
                modeltable.clearTable();
                table.setAllColumnPreferredWidth();
            }
        } catch (SQLException | HeadlessException ex) {
            throw ex;
        }
    }

    private boolean verificarDatos() {
        if (modeltable.getRowCount() == 0) {
            JOptionPane.showMessageDialog(this, "No hay datos que registrar");
            return false;
        }
        for (int i = 0; i < modeltable.getRowCount(); i++) {
            BeanAnexo beanAnexo = modeltable.getBeanAnexo(i);
            if (!(beanAnexo.getNumero().trim().length() == 8 || beanAnexo.getNumero().trim().length() == 11)) {
                JOptionPane.showMessageDialog(this, " Ingrese Correctamente numero de Documento\nFila: " + (i + 1));
                return false;
            }
            if (beanAnexo.getFlagTipoPersona().equals("N")) {
                if (beanAnexo.getPaterno().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, " Ingrese Apellido Paterno\nFila: " + (i + 1));
                    return false;
                }
                if (beanAnexo.getMaterno().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, " Ingrese Apellido Materno\nFila: " + (i + 1));
                    return false;
                }
                if (beanAnexo.getNombre().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, " Ingrese Nombres\nFila: " + (i + 1));
                    return false;
                }
            }
            if (beanAnexo.getDescripcion().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, " Ingrese Descripcion\nFila: " + (i + 1));
                return false;
            }
        }
        return true;
    }

    @Override
    public void valueChanged(ListSelectionEvent lse) {
    }

    @Override
    public void actionPerformed(ActionEvent ae) {
        if (ae.getSource() == btnImportar) {
            importarExcel();
        }
        if (ae.getSource() == btnGuardar) {
            guardarAsiento();
        }
        if (ae.getSource() == cboTipo) {
            modeltable.clearTable();
            modeltable.fireTableDataChanged();
            table.setAllColumnPreferredWidth();
        }
    }

    @Override
    public void focusGained(FocusEvent fe) {
    }

    @Override
    public void focusLost(FocusEvent fe) {
    }

    @Override
    public void keyTyped(KeyEvent ke) {
    }

    @Override
    public void keyPressed(KeyEvent ke) {
    }

    @Override
    public void keyReleased(KeyEvent ke) {
    }
}
