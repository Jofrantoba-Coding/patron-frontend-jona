/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipnlcotizacionbuscar;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanCotizacionCab;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.tablas.CotizacionTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnCotizacionCab;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import java.awt.BorderLayout;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Frame;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.RowFilter;
import javax.swing.table.TableRowSorter;

/**
 *
 * @author Team Develtrex
 */
public class UiPnlCotizacionBuscar extends JDialog implements InterUiPnlCotizacionBuscar, ActionListener, MouseListener,KeyListener {

    protected Gif gif;
    protected Usuario usuario;
    protected Frame frame;
    protected java.net.URL path;
    protected JTextField txt_codigo;
    //private JTextField txt_serie;
    protected JComboBox cboSerie;
    protected JTextField txt_preimpreso;
    protected JTextField txt_cliente;
    protected JTextField txt_docCliente;
    protected JDateChooser dc_fechainicio;
    protected JDateChooser dc_fechafin;
    protected CTable table;
    protected CotizacionTableModel modeltable;
    protected TableRowSorter modeloOrdenado;
    protected JButton btnAceptar;
    protected JButton btnCancelar;
    protected JButton btnBuscar;
    protected Date fechaInicio;
    protected Date fechaFin;
    protected Object pnlPadre;
    protected Component comp;
    protected String strform;
    
    public UiPnlCotizacionBuscar(Frame frame, Usuario usuario, java.net.URL ruta, Object wpnlPadre, Component comp, String strform) {
        super(frame, true);
        this.usuario = usuario;
        this.path = ruta;
        this.frame = frame;
        this.pnlPadre = wpnlPadre;
        this.comp = comp;
        this.strform = strform;
        initComponents();
        initListener();
        txt_preimpreso.requestFocus();
    }

    protected void initComponents() {
        gif = new Gif();
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        pnlPrinc.add(getPnlNorth(), BorderLayout.NORTH);
        pnlPrinc.add(getPnlCenter(), BorderLayout.CENTER);
        pnlPrinc.add(getPnlSouth(), BorderLayout.SOUTH);
        this.getContentPane().add(pnlPrinc);
        setTitle("Listado de Cotizaciones");
        pack();
        //this.setMinimumSize(new Dimension());
        ComponentToolKit.centerComponentPosicion(this);       
    }

    protected void initListener() {
        btnAceptar.addActionListener(this);
        btnCancelar.addActionListener(this);
        btnBuscar.addActionListener(this);
        table.addMouseListener(this);
        table.addKeyListener(this);
        txt_preimpreso.addKeyListener(this);
    }

    public void setFecha(Date fechaInicio, Date fechaFin) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;

        dc_fechainicio.setSelectableDateRange(fechaInicio, fechaFin);
        dc_fechafin.setSelectableDateRange(fechaInicio, fechaFin);
        dc_fechainicio.setDate(fechaInicio);
        dc_fechafin.setDate(fechaFin);
        loadSerieCorrelativo();
        //cargarTabla();
    }

    protected void cargarTabla() {
    }

    protected void filtrar() {
    }

    protected RowFilter getFilter() {
        return null;
    }

    protected JPanel getPnlNorth() {
        JPanel pnlGral = new JPanel();
        pnlGral.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnl.setLayout(new GridBagLayout());
        pnlGral.add(pnl, BorderLayout.WEST);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;

        JLabel lblCodigo = new JLabel("Código");
        lblCodigo.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblCodigo, gbc);

        txt_codigo = new JTextField();
        txt_codigo.setColumns(7);
        txt_codigo.setDocument(new IntegerDocument(6));
        txt_codigo.setFont(new Font("Garamond", 0, 14));
        gbc.gridx = 1;
        pnl.add(txt_codigo, gbc);

        JLabel lblDocumento = new JLabel("Documento");
        lblDocumento.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 2;
        pnl.add(lblDocumento, gbc);

        cboSerie = new JComboBox();
        gbc.gridx = 3;
        pnl.add(cboSerie, gbc);
        txt_preimpreso = new JTextField();
        txt_preimpreso.setColumns(8);
        txt_preimpreso.setDocument(new IntegerDocument(10));
        txt_preimpreso.setFont(new Font("Garamond", 0, 14));
        gbc.gridx = 4;
        pnl.add(txt_preimpreso, gbc);        

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblCliente = new JLabel("Cliente");
        lblCliente.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblCliente, gbc);

        txt_cliente = new JTextField();
        txt_cliente.setDocument(new UpperCaseNumberDocument(100));
        txt_cliente.setFont(new Font("Garamond", 0, 14));
        gbc.gridx = 1;
        gbc.gridwidth = 4;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnl.add(txt_cliente, gbc);
        gbc.fill = GridBagConstraints.NONE;
        gbc.gridwidth = 1;

        JLabel lblNum = new JLabel("RUC/DNI");
        lblNum.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 5;
        pnl.add(lblNum, gbc);

        txt_docCliente = new JTextField();
        txt_docCliente.setColumns(11);
        txt_docCliente.setDocument(new IntegerDocument(11));
        txt_docCliente.setFont(new Font("Garamond", 0, 14));
        gbc.gridx = 6;
        pnl.add(txt_docCliente, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;

        JLabel lblInicio = new JLabel("F Inicio");
        lblInicio.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblInicio, gbc);
        gbc.gridx = 1;
        dc_fechainicio = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        pnl.add(dc_fechainicio, gbc);

        gbc.gridx = 2;
        JLabel lblFin = new JLabel("F Fin");
        lblFin.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblFin, gbc);
        gbc.gridx = 3;
        gbc.gridwidth = 2;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        dc_fechafin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        pnl.add(dc_fechafin, gbc);

        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.NONE;
        gbc.gridx = 5;
        btnBuscar = new JButton("Buscar", gif.SEARCH16);
        pnl.add(btnBuscar, gbc);        
        return pnlGral;
    }

    protected JPanel getPnlCenter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        modeltable = new CotizacionTableModel();
        modeloOrdenado = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        JScrollPane scroll = new JScrollPane(table);
        table.setNoVisibleColumn(3);
        table.setNoVisibleColumn(4);
        table.setNoVisibleColumn(8);
        scroll.setPreferredSize(new Dimension(1200, 380));
        pnl.add(scroll, BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel getPnlSouth() {
        JPanel pnl = new JPanel();
        btnCancelar = new JButton("Cancelar", gif.CANCEL16);
        pnl.add(btnCancelar);
        btnAceptar = new JButton("Agregar", gif.ADD16);
        pnl.add(btnAceptar);
        return pnl;
    }

    protected void obtenerDatos() {
    }

    protected void loadSerieCorrelativo() {
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource().equals(btnCancelar)) {
            dispose();
        }
        if (e.getSource().equals(btnBuscar)) {
            cargarTabla();
        }
        if (e.getSource().equals(btnAceptar)) {
            obtenerDatos();
        }
    }

    @Override
    public void mouseClicked(MouseEvent e) {
        if (e.getSource() == table) {
            if (e.getClickCount() == 2) {
                obtenerDatos();
            }
        }
    }

    @Override
    public void mousePressed(MouseEvent e) {
    }

    @Override
    public void mouseReleased(MouseEvent e) {
    }

    @Override
    public void mouseEntered(MouseEvent e) {
    }

    @Override
    public void mouseExited(MouseEvent e) {
    }

    @Override
    public void keyTyped(KeyEvent e) {        
    }

    @Override
    public void keyPressed(KeyEvent e) {        
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if(e.getSource().equals(txt_preimpreso) && e.getKeyCode()==KeyEvent.VK_ENTER){
            btnBuscar.doClick();
        }else if(e.getSource().equals(table) && e.getKeyCode()==KeyEvent.VK_ENTER){
            btnAceptar.doClick();
        }
    }
}
