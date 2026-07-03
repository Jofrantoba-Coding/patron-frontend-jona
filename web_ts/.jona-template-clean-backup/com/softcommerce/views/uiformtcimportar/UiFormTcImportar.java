/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiformtcimportar;


import com.softcommerce.formularios.importar.*;
import com.softcommerce.formularios.*;
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
public class UiFormTcImportar extends JDialog implements InterUiFormTcImportar, ListSelectionListener, ActionListener, FocusListener, KeyListener {

    protected java.net.URL path;
    protected Usuario usuario;
    protected JButton btnImportar;
    static JFileChooser jChooser;
    protected CTable table;
    protected ImpTcTableModel modeltable;
    protected TableRowSorter modeloOrdenado;
    protected JScrollPane scrollTable;
    protected JButton btnGuardar;

    public UiFormTcImportar(JFrame frame, Usuario usuario, java.net.URL ruta) {
        super(frame, true);
        this.usuario = usuario;
        this.path = ruta;
        initComponents();
    }

    protected void initComponents() {
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

    protected void importarExcel() {
    }

    protected void fillData(File file) throws ParseException, Exception {
    }

    protected void guardarAsiento() {
    }

    protected void guardarTipoCambio() throws Exception {
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