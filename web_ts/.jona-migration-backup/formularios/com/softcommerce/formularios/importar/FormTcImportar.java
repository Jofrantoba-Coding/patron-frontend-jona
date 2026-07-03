/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.formularios.importar;

import com.softcommerce.beans.BeanTipoCambio;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.tablas.ImpTcTableModel;
import com.softcommerce.reglasnegocio.RnTipoCambio;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.table.TableRowSorter;
import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;
import jxl.read.biff.BiffException;
import org.jdesktop.swingx.HorizontalLayout;
//import sun.awt.HorizBagLayout;

/**
 *
 * @author Team Develtrex
 */
public class FormTcImportar extends JDialog implements ListSelectionListener, ActionListener, FocusListener, KeyListener {

    private java.net.URL path;
    private Usuario usuario;
    private JButton btnImportar;
    static JFileChooser jChooser;
    private CTable table;
    private ImpTcTableModel modeltable;
    private TableRowSorter modeloOrdenado;
    private JScrollPane scrollTable;
    private JButton btnGuardar;

    public FormTcImportar(JFrame frame, Usuario usuario, java.net.URL ruta) {
        super(frame, true);
        this.usuario = usuario;
        this.path = ruta;
        initComponents();
    }

    private void initComponents() {
        //
        modeltable = new ImpTcTableModel();
        modeloOrdenado = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        //table.setNoVisibleColumn(3);
        table.getSelectionModel().addListSelectionListener(this);
        scrollTable = new JScrollPane(table);
        //JPanel pnlaux = new JPanel();
        //pnlaux.setLayout(new BorderLayout(0, 0));
        scrollTable.setPreferredSize(new Dimension(800, 450));
        getContentPane().add(scrollTable, BorderLayout.CENTER);
        JPanel pnlOpciones = new JPanel();
        btnGuardar = new JButton("Guardar");
        btnGuardar.addActionListener(this);
        pnlOpciones.add(btnGuardar);
        getContentPane().add(pnlOpciones, BorderLayout.SOUTH);

        //
        JPanel pnlCabecera = new JPanel();
        pnlCabecera.setLayout(new HorizontalLayout(10));
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
            if (!file.getName().endsWith("xls")) {
                JOptionPane.showMessageDialog(null, "Please select only Excel file.", "Error", JOptionPane.ERROR_MESSAGE);
            } else {
                fillData(file);
                modeltable.fireTableDataChanged();
                table.setAllColumnPreferredWidth();
            }
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void fillData(File file) throws ParseException, Exception {
        Workbook workbook = null;
        int j = -1;
        int x = -1;
        try {
            try {
                workbook = Workbook.getWorkbook(file);
            } catch (IOException ex) {
                //Logger.getLogger(excelTojTable.class.getName()).log(Level.SEVERE, null, ex);
                ex.printStackTrace();
            }
            Sheet sheet = workbook.getSheet(0);
            //if (sheet.getColumns() != modeltable.getColumnCount()) {
            if (sheet.getColumns() != 5) {
                JOptionPane.showMessageDialog(this, "Numero de Columnas: " + modeltable.getColumnCount());
                return;
            }
            System.out.println("Cols:" + sheet.getColumns());
            System.out.println("Rows:" + sheet.getRows());
            SimpleDateFormat fe = new SimpleDateFormat("dd/MM/yyyy");
            modeltable.clearTable();
            Cell cell;
            java.util.Date parsed;
            for (j = 1; j < sheet.getRows(); j++) {
                BeanTipoCambio beanTc = new BeanTipoCambio();
                x = 0;
                cell = sheet.getCell(0, j);
                parsed = fe.parse(cell.getContents());
                //System.out.println(cell.getContents());
                beanTc.setFecha(new java.sql.Date(parsed.getTime()));
                x = 1;
                beanTc.setMontocompra(new BigDecimal(sheet.getCell(1, j).getContents().replace(",", ".")));
                x = 2;
                beanTc.setMontoventa(new BigDecimal(sheet.getCell(2, j).getContents().replace(",", ".")));
                x = 3;
                beanTc.setMontocomercial(new BigDecimal(sheet.getCell(3, j).getContents().replace(",", ".")));
                x = 4;
                beanTc.setMontoespecial(new BigDecimal(sheet.getCell(4, j).getContents().replace(",", ".")));
                modeltable.setBeanTipoCambio(beanTc);
            }
            modeltable.fireTableDataChanged();
            table.setAllColumnPreferredWidth();
        } catch (BiffException e) {
            throw e;
            //e.printStackTrace();
        } catch (Exception e) {
            try {
                if (j > -1 && x > -1) {
                    throw new Exception(e.getMessage() + " *Fila: " + (j + 1) + ", Columna: " + (x + 1));
                } else {
                    throw new Exception(e.getMessage());
                }
            } catch (Exception ex) {
                throw ex;
            }
        }
    }

    private void guardarAsiento() {
        try {
            if (verificarDatos()) {
                guardarTipoCambio();
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    private void guardarTipoCambio() throws Exception {
        try {
            RnTipoCambio logic = new RnTipoCambio(path);
            String xmlTc = "";
            xmlTc = "<?xml version=\"1.0\" ?> ";
            xmlTc += "<TCS>";
            SimpleDateFormat fe = new SimpleDateFormat("dd/MM/yy");
            for (int i = 0; i < modeltable.getRowCount(); i++) {
                BeanTipoCambio beanTc = modeltable.getBeanTipoCambio(i);
                xmlTc += "<TC>";
                xmlTc += "<FECHA>" + fe.format(beanTc.getFecha()) + "</FECHA>";
                xmlTc += "<COMPRA>" + beanTc.getMontocompra().toString().replace(".", ",") + "</COMPRA>";
                xmlTc += "<VENTA>" + beanTc.getMontoventa().toString().replace(".", ",") + "</VENTA>";
                xmlTc += "<COMERCIAL>" + beanTc.getMontocomercial().toString().replace(".", ",") + "</COMERCIAL>";
                xmlTc += "<ESPECIAL>" + beanTc.getMontoespecial().toString().replace(".", ",") + "</ESPECIAL>";
                xmlTc += "</TC>";
            }
            xmlTc += "</TCS>";
            System.out.println("xml_Tc: " + xmlTc);
            //xmlAnexo=xmlAnexo.replace("&", " ");
            String rpta = "";
            rpta = logic.importarTipoCambio(usuario.getId_usuario(), usuario.getCodempresa(), xmlTc);
            if (rpta.trim().equals("CORRECTO")) {
                JOptionPane.showMessageDialog(this, "REGISTRADO CORRECTAMENTE");
                modeltable.clearTable();
                table.setAllColumnPreferredWidth();
            }
        } catch (Exception ex) {
            throw ex;
        }
    }

    private boolean verificarDatos() {
        if (modeltable.getRowCount() == 0) {
            JOptionPane.showMessageDialog(this, "No hay datos que registrar");
            return false;
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