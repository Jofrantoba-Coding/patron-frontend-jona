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

    protected final URL path;
    protected final Usuario usuario;
    protected JComboBox cboTipo;
    protected JButton btnImportar;
    static JFileChooser jChooser;
    public CTable table;
    public ImpAnexoTableModel modeltable;
    public TableRowSorter modeloOrdenado;
    protected JScrollPane scrollTable;
    protected JButton btnGuardar;
    protected final Logger logger = Logger.getLogger(UiFormImportarAnexo.class);

    public UiFormImportarAnexo(JFrame frame, Usuario usuario, java.net.URL ruta) {
        super(frame, true);
        this.usuario = usuario;
        this.path = ruta;
        initComponents();
    }

    protected void initComponents() {
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

    protected void importarExcel() {
    }

    protected void fillData(File file) throws ParseException {
    }

    protected void guardarAsiento() {
    }

    protected void guardarAnexo(String id_tipo_anexo) throws Exception {
    }

    protected boolean verificarDatos() {
        return false;
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
