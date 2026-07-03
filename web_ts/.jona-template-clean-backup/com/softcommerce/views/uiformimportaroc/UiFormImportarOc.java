package com.softcommerce.views.uiformimportaroc;


import com.softcommerce.formularios.importar.*;
import com.softcommerce.formularios.*;
import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.BeanImpOc;
import com.softcommerce.beans.BeanItem;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.tablas.ImpOcTableModel;
import com.softcommerce.reglasnegocio.RnOrdenCompra;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.util.Constans;
import com.softcommerce.util.render.CellRendererImpOc;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;
import jxl.read.biff.BiffException;
import org.apache.log4j.Logger;
import org.jdesktop.swingx.HorizontalLayout;

public class UiFormImportarOc
        extends JDialog
        implements InterUiFormImportarOc, ActionListener {

    protected java.net.URL path;
    protected Usuario usuario;
    protected JButton btnImportar;
    static JFileChooser jChooser;
    public CTable table;
    public ImpOcTableModel modeltable;
    protected JButton btnGuardar;
    protected boolean swAlmacen = true;
    protected boolean swItem = true;
    protected final Logger logger = Logger.getLogger(UiFormImportarOc.class);

    public UiFormImportarOc(JFrame frame, Usuario usuario, java.net.URL ruta) {
        super(frame, true);
        this.usuario = usuario;
        this.path = ruta;
        initComponents();
    }

    protected void initComponents() {
        modeltable = new ImpOcTableModel();
        table = new CTable();
        table.setModel(modeltable);
        for (int i = 0; i < modeltable.getColumnCount(); i++) {
            table.getColumnModel().getColumn(i).setCellRenderer(new CellRendererImpOc(modeltable));
        }
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setAllColumnPreferredWidth();
        JScrollPane scrollTable = new JScrollPane(table);
        scrollTable.setPreferredSize(new Dimension(800, 450));
        getContentPane().add(scrollTable, BorderLayout.CENTER);
        JPanel pnlOpciones = new JPanel();
        btnGuardar = new JButton("Guardar");
        btnGuardar.addActionListener(this);
        pnlOpciones.add(btnGuardar);
        getContentPane().add(pnlOpciones, BorderLayout.SOUTH);

        JPanel pnlCabecera = new JPanel();
        pnlCabecera.setLayout(new HorizontalLayout(10));
        btnImportar = new JButton("Importar");
        btnImportar.addActionListener(this);
        pnlCabecera.add(btnImportar);
        getContentPane().add(pnlCabecera, BorderLayout.PAGE_START);
        pack();
        jChooser = new JFileChooser();
    }

    protected void importarExcel() {
    }

    protected void llenarData() throws Exception {
    }

    protected void fillData(File file) throws ParseException, Exception {
    }

    protected void guardarAsiento() {
    }

    protected void guardarOc() throws Exception {
    }

    protected boolean verificarDatos() {
        return false;
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

}
