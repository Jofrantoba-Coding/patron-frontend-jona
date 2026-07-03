/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.formularios;

import com.softcommerce.beans.BeanProveedor;
import com.softcommerce.beans.AnexoActivacion;
import com.softcommerce.beans.AnexoPadron;
import com.softcommerce.beans.Nacionalidad;
import com.softcommerce.beans.BeanTipoDocIden;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CRadioButton;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.AnexoActivacionTableModel;
import com.softcommerce.general.tablas.AnexoPadronTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnProveedor;
import com.softcommerce.reglasnegocio.RnNacionalidad;
import com.softcommerce.reglasnegocio.RnTipoDocIden;
import com.softcommerce.util.render.CellRendererImageEstado;
import com.softcommerce.util.ExceptionHandler;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dialog;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.Frame;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTextField;
import javax.swing.JToolBar;
import javax.swing.SwingConstants;
import javax.swing.border.LineBorder;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;
import javax.swing.table.TableRowSorter;
import org.apache.log4j.Logger;

/**
 *
 * @author Team Develtrex
 */
public class RegisterProveedorNuevo
        extends JHDialog
        implements ActionListener, ItemListener, KeyListener, WindowListener, MouseListener, FocusListener, TableModelListener, ListSelectionListener {

    private Usuario usuario;
    private Gif gif;
    private JTabbedPane tabb;
    private JTextField txt_Codigo;
    private JComboBox cbo_TipoDocIden;
    private List<BeanTipoDocIden> xTipoDocIden;
    private JTextField txt_NumDoc;
    private JTextField txt_ApePaterno;
    private JTextField txt_ApeMaterno;
    private JTextField txt_Nombre;
    private JTextField txt_Descripcion;
    private JLabel lbl_Descripcion;
    private JTextField txt_Direccion;
    private JLabel lbl_Sexo;
    private JPanel panelSexo;
    private CRadioButton rb_SexoMasculino;
    private CRadioButton rb_SexoFemenino;
    private ButtonGroup bg_Sexo;
    private JTextField txt_TelFijo;
    private JTextField txt_TelMovil;
    private JComboBox cbo_Nacionalidad;
    private List<Nacionalidad> xNacionalidad;
    private JTextField txt_Email;
    private JCheckBox chk_agpercepcion;
    private JCheckBox chk_agretencion;
    private JCheckBox chk_buen_contrib;
    private JCheckBox chkEstado;
    //Activacion de Proveedor
    private JButton btn_ActivarProveedor;
    private JButton btn_DesactivarProveedor;
    private CTable tableAnexoActivacion;
    private AnexoActivacionTableModel modeltableAnexoActivacion;
    private TableRowSorter modeloOrdenadoAnexoActivacion;
    private JScrollPane scrollAnexoActivacion;
    //Padrones de Proveedor
    private JButton btn_ActivarPadron;
    private JButton btn_DesactivarPadron;
    private CTable tableProveedorPadron;
    public AnexoPadronTableModel modeltableProveedorPadron;
    private TableRowSorter modeloOrdenadoProveedorPadron;
    private JScrollPane scrollProveedorPadron;
    private final Logger logger = Logger.getLogger(RegisterProveedorNuevo.class);

    public RegisterProveedorNuevo(Frame arg0, Usuario usuario) {
        super(arg0, true);
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    public RegisterProveedorNuevo(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    private void inicialize() {
        addWindowListener(this);
        gif = new Gif();

        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245, 245, 245));

        tabb = new JTabbedPane();
        tabb.addKeyListener(this);
        tabb.addFocusListener(this);

        tabb.addTab("General", getPanelDatosGeneral());
        tabb.addTab("Activación de Proveedor", getPanelActivacion());
        tabb.addTab("Padrones", getPanelPadrones());
        pnl_dialog.add(tabb);

        tabb.setBounds(10, 10, 815, 430);
        pnl_dialog.add(tabb);

        setTitleName("Proveedor");
        setRegister(pnl_dialog);
        setSize(new Dimension(860, 530));
        ComponentToolKit.centerComponentPosicion(this);
    }

    private void initListener() {
    }

    private JPanel getPanelDatosGeneral() {
        JPanel pnlGeneral = new JPanel();
        pnlGeneral.setLayout(new GridBagLayout());
        pnlGeneral.setBackground(new Color(245, 245, 245));
        GridBagConstraints gbc = new GridBagConstraints();
        JLabel lbl_Codigo = new JLabel("Código");
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_Codigo, gbc);

        txt_Codigo = new JTextField();
        txt_Codigo.setEnabled(false);
        txt_Codigo.addKeyListener(this);
        gbc.gridx = 1;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(txt_Codigo, gbc);

        JLabel lbl_TipoDocIden = new JLabel("Tipo de Documento");
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_TipoDocIden, gbc);

        cbo_TipoDocIden = new JComboBox();
        cbo_TipoDocIden.setFont(new Font(Font.SANS_SERIF, 0, 9));
        //cb_TipoDocIden.addKeyListener(this);estaba activado
        cbo_TipoDocIden.addActionListener(this);
        gbc.gridx = 1;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(cbo_TipoDocIden, gbc);

        JLabel lbl_NumDoc = new JLabel("DNI/RUC");
        gbc.gridx = 2;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_NumDoc, gbc);

        txt_NumDoc = new JTextField();
        txt_NumDoc.setDocument(new IntegerDocument(11));
        //txt_NumDoc.setMaximumSize(new Dimension(100,20));
        txt_NumDoc.addFocusListener(this);
        txt_NumDoc.addKeyListener(this);
        txt_NumDoc.setColumns(10);
        gbc.gridx = 3;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(txt_NumDoc, gbc);

        JLabel lbl_ApePaterno = new JLabel("Apellido Paterno");
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_ApePaterno, gbc);
        txt_ApePaterno = new JTextField();
        txt_ApePaterno.addFocusListener(this);
        txt_ApePaterno.setDocument(new UpperCaseDocument(50));
        txt_ApePaterno.addKeyListener(this);
        gbc.gridx = 1;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(txt_ApePaterno, gbc);
        JLabel lbl_ApeMaterno = new JLabel("Apellido Materno");
        gbc.gridx = 2;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_ApeMaterno, gbc);
        txt_ApeMaterno = new JTextField();
        txt_ApeMaterno.setDocument(new UpperCaseDocument(50));
        txt_ApeMaterno.addFocusListener(this);
        txt_ApeMaterno.addKeyListener(this);
        gbc.gridx = 3;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(txt_ApeMaterno, gbc);
        JLabel lbl_Nombre = new JLabel("Nombres");
        gbc.gridx = 0;
        gbc.gridy = 3;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_Nombre, gbc);
        txt_Nombre = new JTextField();
        txt_Nombre.addFocusListener(this);
        txt_Nombre.setDocument(new UpperCaseDocument(50));
        txt_Nombre.addKeyListener(this);
        gbc.gridx = 1;
        gbc.gridy = 3;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(txt_Nombre, gbc);

        lbl_Descripcion = new JLabel("Razón Social");
        gbc.gridx = 0;
        gbc.gridy = 4;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_Descripcion, gbc);
        txt_Descripcion = new JTextField();
        txt_Descripcion.addKeyListener(this);
        txt_Descripcion.addFocusListener(this);
        txt_Descripcion.setDocument(new UpperCaseNumberDocument(300));
        gbc.gridx = 1;
        gbc.gridy = 4;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(txt_Descripcion, gbc);

        JLabel lbl_Direccion = new JLabel("Dirección");
        gbc.gridx = 0;
        gbc.gridy = 5;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_Direccion, gbc);

        txt_Direccion = new JTextField();
        txt_Direccion.setDocument(new UpperCaseNumberDocument(280));
        txt_Direccion.addKeyListener(this);
        txt_Direccion.addFocusListener(this);
        gbc.gridx = 1;
        gbc.gridy = 5;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(txt_Direccion, gbc);

        FlowLayout flow = new FlowLayout(FlowLayout.LEFT);
        panelSexo = new JPanel();
        panelSexo.setLayout(flow);
        lbl_Sexo = new JLabel("Sexo");
        gbc.gridx = 0;
        gbc.gridy = 6;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_Sexo, gbc);
        rb_SexoFemenino = new CRadioButton("Femenino");
        rb_SexoFemenino.addKeyListener(this);
        panelSexo.add(rb_SexoFemenino);
        rb_SexoMasculino = new CRadioButton("Masculino");
        rb_SexoMasculino.addKeyListener(this);
        panelSexo.add(rb_SexoMasculino);
        gbc.gridx = 1;
        gbc.gridy = 6;
        gbc.gridwidth = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(panelSexo, gbc);

        bg_Sexo = new ButtonGroup();
        bg_Sexo.add(rb_SexoFemenino);
        bg_Sexo.add(rb_SexoMasculino);

        JLabel lbl_TelFijo = new JLabel("Telefono Fijo");
        gbc.gridx = 0;
        gbc.gridy = 7;
        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_TelFijo, gbc);

        txt_TelFijo = new JTextField();        
        txt_TelFijo.addKeyListener(this);
        txt_TelFijo.addFocusListener(this);
        gbc.gridx = 1;
        gbc.gridy = 7;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(txt_TelFijo, gbc);

        JLabel lbl_TelMovil = new JLabel("Telefono Movil");
        gbc.gridx = 2;
        gbc.gridy = 7;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_TelMovil, gbc);

        txt_TelMovil = new JTextField();
        txt_TelMovil.setDocument(new IntegerDocument(15));
        txt_TelMovil.addKeyListener(this);
        txt_TelMovil.addFocusListener(this);
        gbc.gridx = 3;
        gbc.gridy = 7;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(txt_TelMovil, gbc);

        JLabel lbl_Nacionalidad = new JLabel("Nacionalidad");
        gbc.gridx = 2;
        gbc.gridy = 8;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_Nacionalidad, gbc);

        cbo_Nacionalidad = new JComboBox();
        cbo_Nacionalidad.setFont(new Font(Font.SANS_SERIF, 0, 9));
        cbo_Nacionalidad.addKeyListener(this);
        gbc.gridx = 3;
        gbc.gridy = 8;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(cbo_Nacionalidad, gbc);

        JLabel lbl_Email = new JLabel("E-Mail");
        gbc.gridx = 0;
        gbc.gridy = 9;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_Email, gbc);

        txt_Email = new JTextField();
        txt_Email.addKeyListener(this);
        txt_Email.addFocusListener(this);
        gbc.gridx = 1;
        gbc.gridy = 9;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(txt_Email, gbc);

        chkEstado = new JCheckBox("Estado");
        chkEstado.setEnabled(false);
        gbc.gridx = 2;
        gbc.gridy = 9;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(chkEstado, gbc);

        JPanel panelPatrones = new JPanel();
        panelPatrones.setLayout(flow);
        chk_agpercepcion = new JCheckBox("A Percepcion");
        chk_agpercepcion.addKeyListener(this);
        chk_agpercepcion.setHorizontalTextPosition(SwingConstants.LEFT);
        chk_agpercepcion.addFocusListener(this);
        chk_agpercepcion.addItemListener(this);
        chk_agpercepcion.setOpaque(false);
        chk_agpercepcion.setEnabled(false);
        panelPatrones.add(chk_agpercepcion);
        chk_agretencion = new JCheckBox("A Retencion");
        chk_agretencion.addKeyListener(this);
        chk_agretencion.setHorizontalTextPosition(SwingConstants.LEFT);
        chk_agretencion.addFocusListener(this);
        chk_agretencion.addItemListener(this);
        chk_agretencion.setOpaque(false);
        chk_agretencion.setEnabled(false);
        panelPatrones.add(chk_agretencion);

        chk_buen_contrib = new JCheckBox("Buen Contribuyente");
        chk_buen_contrib.addKeyListener(this);
        chk_buen_contrib.setHorizontalTextPosition(SwingConstants.LEFT);
        chk_buen_contrib.addFocusListener(this);
        chk_buen_contrib.addItemListener(this);
        chk_buen_contrib.setOpaque(false);
        chk_buen_contrib.setEnabled(false);
        panelPatrones.add(chk_buen_contrib);

        gbc.gridx = 0;
        gbc.gridy = 10;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        gbc.gridwidth = 3;
        pnlGeneral.add(panelPatrones, gbc);

        return pnlGeneral;
    }

    private JPanel getPanelActivacion() {
        JPanel pnlActivacion = new JPanel(new BorderLayout());
        pnlActivacion.setLayout(new BorderLayout(0, 0));
        pnlActivacion.setBackground(new Color(245, 245, 245));
        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setPreferredSize(new Dimension(0, 30));

        btn_ActivarProveedor = new JButton("Activar", gif.ADD16);
        btn_ActivarProveedor.setMnemonic('A');
        btn_ActivarProveedor.setHorizontalAlignment(SwingConstants.LEFT);
        btn_ActivarProveedor.setIconTextGap(10);
        btn_ActivarProveedor.addActionListener(this);
        btn_ActivarProveedor.setOpaque(false);
        btn_ActivarProveedor.addKeyListener(this);
        btn_ActivarProveedor.setFocusPainted(false);
        btn_ActivarProveedor.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btn_ActivarProveedor);

        toolbar.addSeparator();

        btn_DesactivarProveedor = new JButton("Desactivar", gif.ELIMINATE16);
        btn_DesactivarProveedor.setMnemonic('D');
        btn_DesactivarProveedor.setHorizontalAlignment(SwingConstants.LEFT);
        btn_DesactivarProveedor.setIconTextGap(10);
        btn_DesactivarProveedor.addActionListener(this);
        btn_DesactivarProveedor.setOpaque(false);
        btn_DesactivarProveedor.addKeyListener(this);
        btn_DesactivarProveedor.setFocusPainted(false);
        btn_DesactivarProveedor.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btn_DesactivarProveedor);

        pnlActivacion.add(toolbar, BorderLayout.NORTH);

        modeltableAnexoActivacion = new AnexoActivacionTableModel();
        modeloOrdenadoAnexoActivacion = new TableRowSorter(modeltableAnexoActivacion);
        tableAnexoActivacion = new CTable();
        tableAnexoActivacion.setRowSorter(modeloOrdenadoAnexoActivacion);
        tableAnexoActivacion.setModel(modeltableAnexoActivacion);
        tableAnexoActivacion.setAllTableNoEditable();
        tableAnexoActivacion.setAllColumnNoResizable();
        tableAnexoActivacion.setRendererColumnZero();
        tableAnexoActivacion.setAllColumnPreferredWidth();
        tableAnexoActivacion.getSelectionModel().addListSelectionListener(this);
        scrollAnexoActivacion = new JScrollPane(tableAnexoActivacion);
        scrollAnexoActivacion.setPreferredSize(new Dimension(1200, 380));

        pnlActivacion.add(scrollAnexoActivacion, BorderLayout.CENTER);

        return pnlActivacion;
    }

    private JPanel getPanelPadrones() {
        JPanel pnlPadrones = new JPanel(new BorderLayout());
        pnlPadrones.setLayout(new BorderLayout(0, 0));
        pnlPadrones.setBackground(new Color(245, 245, 245));
        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setPreferredSize(new Dimension(0, 30));

        btn_ActivarPadron = new JButton("Activar", gif.ADD16);
        btn_ActivarPadron.setMnemonic('A');
        btn_ActivarPadron.setHorizontalAlignment(SwingConstants.LEFT);
        btn_ActivarPadron.setIconTextGap(10);
        btn_ActivarPadron.addActionListener(this);
        btn_ActivarPadron.setOpaque(false);
        btn_ActivarPadron.addKeyListener(this);
        btn_ActivarPadron.setFocusPainted(false);
        btn_ActivarPadron.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btn_ActivarPadron);

        toolbar.addSeparator();

        btn_DesactivarPadron = new JButton("Desactivar", gif.ELIMINATE16);
        btn_DesactivarPadron.setMnemonic('D');
        btn_DesactivarPadron.setHorizontalAlignment(SwingConstants.LEFT);
        btn_DesactivarPadron.setIconTextGap(10);
        btn_DesactivarPadron.addActionListener(this);
        btn_DesactivarPadron.setOpaque(false);
        btn_DesactivarPadron.addKeyListener(this);
        btn_DesactivarPadron.setFocusPainted(false);
        btn_DesactivarPadron.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btn_DesactivarPadron);

        pnlPadrones.add(toolbar, BorderLayout.NORTH);

        modeltableProveedorPadron = new AnexoPadronTableModel();
        modeloOrdenadoProveedorPadron = new TableRowSorter(modeltableProveedorPadron);
        tableProveedorPadron = new CTable();
        tableProveedorPadron.setRowSorter(modeloOrdenadoProveedorPadron);
        tableProveedorPadron.setModel(modeltableProveedorPadron);
        tableProveedorPadron.setAllTableNoEditable();
        tableProveedorPadron.setAllColumnNoResizable();
        tableProveedorPadron.setRendererColumnZero();
        tableProveedorPadron.setAllColumnPreferredWidth();
        tableProveedorPadron.getSelectionModel().addListSelectionListener(this);
        scrollProveedorPadron = new JScrollPane(tableProveedorPadron);
        scrollProveedorPadron.setPreferredSize(new Dimension(1200, 380));

        pnlPadrones.add(scrollProveedorPadron, BorderLayout.CENTER);
        return pnlPadrones;
    }

    private void loadTipoDocIden() throws Exception {
        try {
            RnTipoDocIden regla_TipoDocIden = new RnTipoDocIden(path);

            if (xTipoDocIden != null) {
                xTipoDocIden.clear();
            } else {
                xTipoDocIden = new ArrayList<BeanTipoDocIden>();
            }

            xTipoDocIden = regla_TipoDocIden.listarTipoDocIden("", "A", "S");

            cbo_TipoDocIden.removeAllItems();
            cbo_TipoDocIden.addItem("--- Seleccione un Tipo de Documento de Identidad ---");

            for (int i = 0; i < xTipoDocIden.size(); i++) {
                cbo_TipoDocIden.addItem(xTipoDocIden.get(i).getAbreviatura());
            }

            cbo_TipoDocIden.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadNacionalidad() throws Exception {
        try {
            RnNacionalidad regla_Nacionalidad = new RnNacionalidad(path);

            if (xNacionalidad != null) {
                xNacionalidad.clear();
            } else {
                xNacionalidad = new ArrayList<Nacionalidad>();
            }

            xNacionalidad = regla_Nacionalidad.listarUbicacion("");

            cbo_Nacionalidad.removeAllItems();
            cbo_Nacionalidad.addItem("--- Seleccione Nacionalidad ---");

            for (int i = 0; i < xNacionalidad.size(); i++) {
                cbo_Nacionalidad.addItem(xNacionalidad.get(i).getDescripcion());
            }

            cbo_Nacionalidad.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    private BeanProveedor llenarBeanProveedor() {
        BeanProveedor beanProveedor = new BeanProveedor();
        SimpleDateFormat fe = new SimpleDateFormat("dd/MM/yyyy");
        beanProveedor.setId_proveedor(txt_Codigo.getText().trim());
        String flag_tipo_persona = "N";
        char val = txt_NumDoc.getText().charAt(0);
        //flag_tipo_persona = (cbo_TipoDocIden.getSelectedItem().toString().trim().equals("RUC") && val == '1') ? "J" : "N";
        //System.out.println("Tipo Doc: " + xTipoDocIden.get(cbo_TipoDocIden.getSelectedIndex() - 1).getCodigo());
        flag_tipo_persona = (xTipoDocIden.get(cbo_TipoDocIden.getSelectedIndex() - 1).getId_tipo_doc().equals("05") && val == '2') ? "J" : "N";
        beanProveedor.setFlag_tipo_persona(flag_tipo_persona);
        beanProveedor.setPaterno(txt_ApePaterno.getText().trim());
        beanProveedor.setMaterno(txt_ApeMaterno.getText().trim());
        beanProveedor.setNombres(txt_Nombre.getText().trim());
        beanProveedor.setDescripcion(txt_Descripcion.getText().trim());
        BeanTipoDocIden beanTDV = new BeanTipoDocIden();
        beanTDV.setId_tipo_doc(cbo_TipoDocIden.getSelectedIndex() > 0 ? xTipoDocIden.get(cbo_TipoDocIden.getSelectedIndex() - 1).getId_tipo_doc() : "");
        beanProveedor.setTipo_doc(beanTDV);
        beanProveedor.setNumero(txt_NumDoc.getText().trim());
        beanProveedor.setDireccion(txt_Direccion.getText().trim());
        beanProveedor.setSexo(rb_SexoMasculino.isSelected() ? "M" : "F");
        beanProveedor.setTelefono(txt_TelFijo.getText().trim());
        beanProveedor.setCelular(txt_TelMovil.getText().trim());
        beanProveedor.setEmail(txt_Email.getText().trim());
        beanProveedor.setId_nacionalidad(cbo_Nacionalidad.getSelectedIndex() > 0 ? xNacionalidad.get(cbo_Nacionalidad.getSelectedIndex() - 1).getCodigo() : "");
        beanProveedor.setFlag_percepcion(chk_agpercepcion.isSelected() ? "S" : "N");
        beanProveedor.setFlag_retencion(chk_agretencion.isSelected() ? "S" : "N");
        beanProveedor.setFlag_buen_contrib(chk_buen_contrib.isSelected() ? "S" : "N");
        beanProveedor.setEstado(chkEstado.isSelected() ? "A" : "D");
        beanProveedor.setId_usuario(usuario.getId_usuario());
        //Llenar XmlActivacion
        String xmlActivacion = "";
        xmlActivacion = "<?xml version=\"1.0\" ?> ";
        xmlActivacion += "<ACTIVACIONES>";
        for (int i = 0; i < modeltableAnexoActivacion.getRowCount(); i++) {
            AnexoActivacion beanAnexoActivacion = modeltableAnexoActivacion.getAnexoActivacion(i);
            if (!beanAnexoActivacion.getOperacion().equals("")) {
                xmlActivacion += "<ACTIVACION>";
                xmlActivacion += "<ID_ACTIVACION>" + beanAnexoActivacion.getIdActivacion() + "</ID_ACTIVACION>";
                xmlActivacion += "<F_INICIO>" + fe.format(beanAnexoActivacion.getFechaInicio()) + "</F_INICIO>";
                xmlActivacion += "<F_FIN>" + ((beanAnexoActivacion.getFechaFin() == null) ? beanAnexoActivacion.getFechaFin() : fe.format(beanAnexoActivacion.getFechaFin())) + "</F_FIN>";
                xmlActivacion += "<ESTADO>" + beanAnexoActivacion.getEstado() + "</ESTADO>";
                xmlActivacion += "<MOTIVO_ACTIVACION>" + beanAnexoActivacion.getMotivoActivacion() + "</MOTIVO_ACTIVACION>";
                xmlActivacion += "<MOTIVO_DESACTIVACION>" + ((beanAnexoActivacion.getMotivoDesactivacion() == null) ? "" : beanAnexoActivacion.getMotivoDesactivacion()) + "</MOTIVO_DESACTIVACION>";
                xmlActivacion += "<OPERACION>" + beanAnexoActivacion.getOperacion() + "</OPERACION>";
                xmlActivacion += "</ACTIVACION>";
            }
        }
        xmlActivacion += "</ACTIVACIONES>";
        System.out.println("xml_activacion: " + xmlActivacion);
        beanProveedor.setXmlActivacion(xmlActivacion);

        //Llenar XmlPadron
        String xmlPadron = "";
        xmlPadron = "<?xml version=\"1.0\" ?> ";
        xmlPadron += "<PADRONES>";
        for (int i = 0; i < modeltableProveedorPadron.getRowCount(); i++) {
            AnexoPadron beanProveedorPadron = modeltableProveedorPadron.getAnexoPadron(i);
            if (!beanProveedorPadron.getOperacion().equals("")) {
                xmlPadron += "<PADRON>";
                xmlPadron += "<ID_Proveedor_PADRON>" + beanProveedorPadron.getIdPadronAnexo() + "</ID_Proveedor_PADRON>";
                xmlPadron += "<ID_PADRON>" + beanProveedorPadron.getIdPadron() + "</ID_PADRON>";
                xmlPadron += "<F_INICIO>" + fe.format(beanProveedorPadron.getFecInicio()) + "</F_INICIO>";
                xmlPadron += "<F_FIN>" + ((beanProveedorPadron.getFecfin() == null) ? beanProveedorPadron.getFecfin() : fe.format(beanProveedorPadron.getFecfin())) + "</F_FIN>";
                xmlPadron += "<ESTADO>" + beanProveedorPadron.getEstado() + "</ESTADO>";
                xmlPadron += "<OPERACION>" + beanProveedorPadron.getOperacion() + "</OPERACION>";
                xmlPadron += "</PADRON>";
            }
        }
        xmlPadron += "</PADRONES>";
        System.out.println("xml_Padron: " + xmlPadron);
        beanProveedor.setXmlPadron(xmlPadron);

        return beanProveedor;
    }

    private void activacionDefecto() {
        try {
            //Vector<AnexoActivacion> ls_AnexoActivacion = new Vector<AnexoActivacion>();
            AnexoActivacion anexoActivacion = new AnexoActivacion();
            anexoActivacion.setIdActivacion(0);
            anexoActivacion.setIdAnexo("");
            anexoActivacion.setMotivoActivacion("INICIO");
            anexoActivacion.setFechaInicio(Main.fechaActualServer);
            anexoActivacion.setEstado("A");
            anexoActivacion.setOperacion("I");
            modeloOrdenadoAnexoActivacion.setRowFilter(null);
            //modeltableAnexoActivacion.clearTable();
            //modeltableAnexoActivacion.agregarVectorProveedor(regla.listarProveedor(""));
            modeltableAnexoActivacion.setAnexoActivacion(anexoActivacion);
            //modeloOrdenadoAnexoActivacion.setRowFilter(getFilter());
            tableAnexoActivacion.setAllColumnPreferredWidth();
            tableAnexoActivacion.getColumnModel().getColumn(0).setCellRenderer(new CellRendererImageEstado());
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
        }
    }

    private void desactivarPadron() {
        if (tableProveedorPadron.getRowCount() == 0) {
            return;
        }
        if (tableProveedorPadron.getSelectedRow() >= 0) {
            if (modeltableProveedorPadron.getAnexoPadron(tableProveedorPadron.convertRowIndexToModel(tableProveedorPadron.getSelectedRow())).getEstado().equals("D")) {
                JOptionPane.showMessageDialog(this, "Padron Seleccionado ya esta desactivado", "Padrones", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            int xres = JOptionPane.showConfirmDialog(this, "Desea Desactivar Padron?", "Padrones", JOptionPane.OK_CANCEL_OPTION);
            if (xres == JOptionPane.OK_OPTION) {
                modeltableProveedorPadron.getAnexoPadron(tableProveedorPadron.convertRowIndexToModel(tableProveedorPadron.getSelectedRow())).setFecfin(Main.fechaActualServer);
                modeltableProveedorPadron.getAnexoPadron(tableProveedorPadron.convertRowIndexToModel(tableProveedorPadron.getSelectedRow())).setEstado("D");
                if (modeltableProveedorPadron.getAnexoPadron(tableProveedorPadron.convertRowIndexToModel(tableProveedorPadron.getSelectedRow())).getIdPadron().equals("04")) {
                    chk_buen_contrib.setSelected(false);
                } else if (modeltableProveedorPadron.getAnexoPadron(tableProveedorPadron.convertRowIndexToModel(tableProveedorPadron.getSelectedRow())).getIdPadron().equals("02")) {
                    chk_agretencion.setSelected(false);
                } else if (modeltableProveedorPadron.getAnexoPadron(tableProveedorPadron.convertRowIndexToModel(tableProveedorPadron.getSelectedRow())).getIdPadron().equals("03")) {
                    chk_agpercepcion.setSelected(false);
                }
                if (modeltableProveedorPadron.getAnexoPadron(tableProveedorPadron.convertRowIndexToModel(tableProveedorPadron.getSelectedRow())).getOperacion().equals("")) {
                    modeltableProveedorPadron.getAnexoPadron(tableProveedorPadron.convertRowIndexToModel(tableProveedorPadron.getSelectedRow())).setOperacion("A");
                }
            }
        } else {
            JOptionPane.showMessageDialog(this, "Seleccionar Fila", "Padrones", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    @Override
    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        if (cbo_TipoDocIden.getSelectedIndex() < 1) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Proveedor, debes Seleccionar un Tipo de Documento.", "Datos incompletos de Proveedor", JOptionPane.CANCEL_OPTION);
            cbo_TipoDocIden.setBorder(new LineBorder(Color.RED));
            cbo_TipoDocIden.requestFocus();
            return false;
        }
        if (cbo_TipoDocIden.getSelectedItem().equals("DNI")) {
            if (this.txt_NumDoc.getText().length() < 8) {
                JOptionPane.showMessageDialog(this, "El número de DNI que has especificado no es válida. Compruébala e inténtalo de nuevo.", "Datos incompletos del Proveedor", 2);
                txt_NumDoc.setBorder(new LineBorder(Color.RED));
                txt_NumDoc.requestFocus();
                txt_NumDoc.selectAll();
                return false;
            }
            txt_ApePaterno.setBorder(txt.getBorder());
            if (txt_ApePaterno.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Proveedor, debes " + "especificar su Apellido Paterno.", "Datos incompletos del Proveedor", JOptionPane.CANCEL_OPTION);
                txt_ApePaterno.setBorder(new LineBorder(Color.RED));
                txt_ApePaterno.requestFocus();
                return false;
            }
            txt_ApeMaterno.setBorder(txt.getBorder());
            if (txt_ApeMaterno.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Proveedor, debes " + "especificar su Apellido Materno.", "Datos incompletos del Proveedor", JOptionPane.CANCEL_OPTION);
                txt_ApeMaterno.setBorder(new LineBorder(Color.RED));
                txt_ApeMaterno.requestFocus();
                return false;
            }
            txt_Nombre.setBorder(txt.getBorder());
            if (txt_Nombre.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Proveedor, debes " + "especificar su Nombre.", "Datos incompletos del Proveedor", JOptionPane.CANCEL_OPTION);
                txt_Nombre.setBorder(new LineBorder(Color.RED));
                txt_Nombre.requestFocus();
                return false;
            }
        }
        if (cbo_TipoDocIden.getSelectedItem().equals("RUC")) {
            if (this.txt_NumDoc.getText().length() < 11) {
                JOptionPane.showMessageDialog(this, "El número de RUC que has especificado no es válida. Compruébala e inténtalo de nuevo.", "Datos incompletos del Proveedor", 2);
                txt_NumDoc.setBorder(new LineBorder(Color.RED));
                txt_NumDoc.requestFocus();
                txt_NumDoc.selectAll();

                return false;
            }
            char val = txt_NumDoc.getText().charAt(0);
            if (val == '1') {
                txt_ApePaterno.setBorder(txt.getBorder());
                if (txt_ApePaterno.getText().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, "Para " + namemode + " un Proveedor, debes " + "especificar su Apellido Paterno.", "Datos incompletos del Proveedor", JOptionPane.CANCEL_OPTION);
                    txt_ApePaterno.setBorder(new LineBorder(Color.RED));
                    txt_ApePaterno.requestFocus();
                    return false;
                }
                txt_ApeMaterno.setBorder(txt.getBorder());
                if (txt_ApeMaterno.getText().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, "Para " + namemode + " un Proveedor, debes " + "especificar su Apellido Materno.", "Datos incompletos del Proveedor", JOptionPane.CANCEL_OPTION);
                    txt_ApeMaterno.setBorder(new LineBorder(Color.RED));
                    txt_ApeMaterno.requestFocus();
                    return false;
                }
                txt_Nombre.setBorder(txt.getBorder());
                if (txt_Nombre.getText().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, "Para " + namemode + " un Proveedor, debes " + "especificar su Nombre.", "Datos incompletos del Proveedor", JOptionPane.CANCEL_OPTION);
                    txt_Nombre.setBorder(new LineBorder(Color.RED));
                    txt_Nombre.requestFocus();
                    return false;
                }
            }

        }
        txt_Descripcion.setBorder(txt.getBorder());
        if (txt_Descripcion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Proveedor, debes " + "especificar su Descripcion.", "Datos incompletos del Proveedor", JOptionPane.CANCEL_OPTION);
            txt_Descripcion.setBorder(new LineBorder(Color.RED));
            txt_Descripcion.requestFocus();
            return false;
        }

        if (cbo_Nacionalidad.getSelectedIndex() < 1) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Proveedor, debes Seleccionar una Nacionalidad.", "Datos incompletos de Proveedor", JOptionPane.CANCEL_OPTION);
            cbo_Nacionalidad.setBorder(new LineBorder(Color.RED));
            cbo_Nacionalidad.requestFocus();
            return false;
        }
        return true;
    }

    @Override
    public void showMessagePrint(String codigo) {
    }

    @Override
    public void setRegisterEnabled(boolean flag) {
        //throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void setRegisterEditable(boolean flag) {
        cbo_TipoDocIden.setEnabled(flag);
        txt_NumDoc.setEditable(flag);
        txt_ApePaterno.setEditable(flag);
        txt_ApeMaterno.setEditable(flag);
        txt_Nombre.setEditable(flag);
        txt_Descripcion.setEditable(flag);
        txt_Direccion.setEditable(flag);
        txt_TelFijo.setEditable(flag);
        txt_TelMovil.setEditable(flag);
        cbo_Nacionalidad.setEnabled(flag);
        txt_Email.setEditable(flag);
    }

    @Override
    public void loadCombo() {
        try {
            loadTipoDocIden();
            loadNacionalidad();
            tableProveedorPadron.getColumnModel().getColumn(0).setCellRenderer(new CellRendererImageEstado());
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void newRegister() {
        JTextField txt = new JTextField();
        txt_Codigo.setText("");
        txt_NumDoc.setEnabled(false);
        txt_ApePaterno.setEnabled(false);
        txt_ApeMaterno.setEnabled(false);
        txt_Nombre.setEnabled(false);
        txt_Descripcion.setEnabled(false);
        rb_SexoMasculino.setSelected(true);
        cbo_Nacionalidad.setSelectedItem("PERUANA");
        cbo_TipoDocIden.setBorder(txt.getBorder());
        chkEstado.setSelected(true);
        activacionDefecto();
        btn_ActivarProveedor.setEnabled(false);
        btn_DesactivarProveedor.setEnabled(false);
    }

    @Override
    public boolean loadRegister() {
        try {
            BeanProveedor beanProveedor = new BeanProveedor();
            txt_Codigo.setText(rowSelection.getSelectedValue(1).toString());
            RnProveedor regla = new RnProveedor(path);
            beanProveedor = regla.beanProveedor(rowSelection.getSelectedValue(1).toString());
            cbo_TipoDocIden.setSelectedItem(beanProveedor.getTipo_doc().getAbreviatura());
            txt_NumDoc.setText(beanProveedor.getNumero());
            txt_ApePaterno.setText(beanProveedor.getPaterno());
            txt_ApeMaterno.setText(beanProveedor.getMaterno());
            txt_Nombre.setText(beanProveedor.getNombres());
            txt_Descripcion.setText(beanProveedor.getDescripcion());
            txt_Direccion.setText(beanProveedor.getDireccion());
            rb_SexoMasculino.setSelected(beanProveedor.getSexo().equals("M"));
            rb_SexoFemenino.setSelected(beanProveedor.getSexo().equals("F"));
            txt_TelFijo.setText(beanProveedor.getTelefono());
            txt_TelMovil.setText(beanProveedor.getCelular());
            txt_Email.setText(beanProveedor.getEmail());
            cbo_Nacionalidad.setSelectedItem(beanProveedor.getDesc_nacionalidad());
            chkEstado.setSelected(beanProveedor.getEstado().equals("A"));
            chk_agpercepcion.setSelected(beanProveedor.getFlag_percepcion().equals("S"));
            chk_agretencion.setSelected(beanProveedor.getFlag_retencion().equals("S"));
            chk_buen_contrib.setSelected(beanProveedor.getFlag_buen_contrib().equals("S"));
            //Anexo Activacion
            modeltableAnexoActivacion.agregarVectorAnexoActivacion(beanProveedor.getListaActivacion());
            modeltableAnexoActivacion.fireTableDataChanged();
            tableAnexoActivacion.getColumnModel().getColumn(0).setCellRenderer(new CellRendererImageEstado());
            //Proveedor PADRONES
            modeltableProveedorPadron.agregarListAnexoPadron(beanProveedor.getListaprovPadron());
            tableProveedorPadron.setAllColumnPreferredWidth();
            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
            return false;
        }
    }

    @Override
    public boolean loadRegister(Object o) {
        return false;
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
        if (comp == btn_ActivarPadron) {
            modeloOrdenadoProveedorPadron.setRowFilter(null);
            modeltableProveedorPadron.setAnexoPadron((AnexoPadron) valor);
            modeltableProveedorPadron.fireTableDataChanged();
            if (((AnexoPadron) valor).getIdPadron().equals("01")) {
                chk_buen_contrib.setSelected((((AnexoPadron) valor).getEstado().equals("A")));
            } else if (((AnexoPadron) valor).getIdPadron().equals("02")) {
                chk_agretencion.setSelected((((AnexoPadron) valor).getEstado().equals("A")));
            } else {
                chk_agpercepcion.setSelected((((AnexoPadron) valor).getEstado().equals("A")));
            }
        }
    }

    @Override
    public void showMessageSuccessfulInsert() {
    }

    @Override
    public void showMessageSuccessfulUpdate() {
    }

    @Override
    public void showMessageSuccessfulDelete() {
    }

    @Override
    public void showMessageErrorDelete() {
    }

    @Override
    public void showMessageErrorUpdate() {
    }

    @Override
    public void showMessageErrorInsert() {
    }

    @Override
    public String executeInsert() {
        try {
            BeanProveedor beanProveedor = new BeanProveedor();
            beanProveedor = llenarBeanProveedor();
            String rpta = "";
            RnProveedor logicProveedor = new RnProveedor(path);
            rpta = logicProveedor.mantProveedor(beanProveedor, "I");
            return rpta;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Proveedor", JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public String executeUpdate() {
        try {
            BeanProveedor beanProveedor = new BeanProveedor();
            beanProveedor = llenarBeanProveedor();
            String rpta = "";
            RnProveedor logicProveedor = new RnProveedor(path);
            rpta = logicProveedor.mantProveedor(beanProveedor, "A");
            return rpta;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Proveedor", JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public boolean executeDelete() {
        return false;
    }

    @Override
    public boolean executeAnular() {
        return false;
    }

    @Override
    public boolean executeSelect() {
        return false;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (cbo_TipoDocIden == e.getSource()) {
            if (cbo_TipoDocIden.getSelectedIndex() == 0) {
                txt_NumDoc.setEnabled(false);
                txt_ApePaterno.setEnabled(false);
                txt_ApeMaterno.setEnabled(false);
                txt_Nombre.setEnabled(false);
                txt_Descripcion.setEnabled(false);
            } else if (String.valueOf(cbo_TipoDocIden.getSelectedItem()).equalsIgnoreCase("DNI")) {
                txt_ApePaterno.setEnabled(true);
                txt_ApeMaterno.setEnabled(true);
                txt_Nombre.setEnabled(true);
                txt_Descripcion.setEnabled(false);
                txt_NumDoc.setEnabled(true);
                txt_NumDoc.setDocument(new IntegerDocument(8));
                //txt_NumDoc.setText(null);
                rb_SexoMasculino.setEnabled(true);
                rb_SexoFemenino.setEnabled(true);
                lbl_Descripcion.setVisible(false);
                txt_Descripcion.setVisible(false);
                lbl_Sexo.setVisible(true);
                panelSexo.setVisible(true);
                txt_NumDoc.requestFocus();
            } else if (String.valueOf(cbo_TipoDocIden.getSelectedItem()).equalsIgnoreCase("RUC")) {
                txt_ApePaterno.setEnabled(false);
                txt_ApeMaterno.setEnabled(false);
                txt_Nombre.setEnabled(false);
                txt_Descripcion.setEnabled(true);
                txt_NumDoc.setEnabled(true);
                txt_NumDoc.setDocument(new IntegerDocument(11));
                //txt_NumDoc.setText(null);
                rb_SexoMasculino.setEnabled(false);
                rb_SexoFemenino.setEnabled(false);
                lbl_Descripcion.setVisible(true);
                txt_Descripcion.setVisible(true);
                lbl_Sexo.setVisible(false);
                panelSexo.setVisible(false);
                txt_NumDoc.requestFocus();
            } else {
                txt_ApePaterno.setEnabled(false);
                txt_ApeMaterno.setEnabled(false);
                txt_Nombre.setEnabled(false);
                txt_Descripcion.setEnabled(true);
                txt_NumDoc.setEnabled(true);
                txt_NumDoc.setDocument(new IntegerDocument(11));
                //txt_NumDoc.setText(null);
                rb_SexoMasculino.setEnabled(false);
                rb_SexoFemenino.setEnabled(false);
                lbl_Descripcion.setVisible(true);
                txt_Descripcion.setVisible(true);
                lbl_Sexo.setVisible(false);
                panelSexo.setVisible(false);
                txt_NumDoc.requestFocus();
            }
            txt_ApeMaterno.setText(null);
            txt_ApePaterno.setText(null);
            txt_Nombre.setText(null);
            txt_Descripcion.setText(null);
            txt_NumDoc.setText(null);
        }
        if (btn_ActivarProveedor == e.getSource()) {
            //Verificar si Existe Activado
            if (modeltableAnexoActivacion.getAnexoActivacion(modeltableAnexoActivacion.getRowCount() - 1).getEstado().equals("A")) {
                JOptionPane.showMessageDialog(this, "Proveedor ya Esta Activado");
                return;
            }
            if (!modeltableAnexoActivacion.getAnexoActivacion(modeltableAnexoActivacion.getRowCount() - 1).getOperacion().equals("")) {
                JOptionPane.showMessageDialog(this, "Proveedor recien lo acaba de Desactivar");
                return;
            }
            FormAnexoActivacion frmAnexoActivacion = new FormAnexoActivacion(this, path, "A", "Proveedor");//,btn_ActivarProveedor
            if (frmAnexoActivacion.swRegistro) {
                AnexoActivacion anexoActivacion = new AnexoActivacion();
                anexoActivacion.setIdActivacion(0);
                anexoActivacion.setIdAnexo("");
                anexoActivacion.setMotivoActivacion(frmAnexoActivacion.getTxtMotivo().getText().trim());
                java.util.Date fechaini = frmAnexoActivacion.getDc_fechainicio().getDate();
                java.sql.Date ini = new java.sql.Date(fechaini.getTime());
                anexoActivacion.setFechaInicio(ini);
                anexoActivacion.setEstado("A");
                anexoActivacion.setOperacion("I");
                modeloOrdenadoAnexoActivacion.setRowFilter(null);
                modeltableAnexoActivacion.setAnexoActivacion(anexoActivacion);
                modeltableAnexoActivacion.fireTableDataChanged();
                chkEstado.setSelected(true);
            }
        }
        if (btn_DesactivarProveedor == e.getSource()) {
            int row;
            if (tableAnexoActivacion.getRowCount() == 0) {
                return;
            }
            row = tableAnexoActivacion.getSelectedRow();
            if (row >= 0) {
                if (modeltableAnexoActivacion.getAnexoActivacion(row).getEstado().equals("D")) {
                    JOptionPane.showMessageDialog(this, "Registro ya esta Desactivado");
                    return;
                }
                if (!(modeltableAnexoActivacion.getAnexoActivacion(row).getOperacion() == null ? "" : modeltableAnexoActivacion.getAnexoActivacion(row).getOperacion()).equals("")) {
                    JOptionPane.showMessageDialog(this, "Proveedor recien lo acaba de Activar");
                    return;
                }
                FormAnexoActivacion frmAnexoActivacion = new FormAnexoActivacion(this, path, "D", "Proveedor");
                if (frmAnexoActivacion.swRegistro) {
                    modeltableAnexoActivacion.getAnexoActivacion(row).setEstado("D");
                    modeltableAnexoActivacion.getAnexoActivacion(row).setOperacion("A");
                    modeltableAnexoActivacion.getAnexoActivacion(row).setMotivoDesactivacion(frmAnexoActivacion.getTxtMotivo().getText().trim());
                    java.util.Date fechafin = frmAnexoActivacion.getDc_fechainicio().getDate();
                    java.sql.Date fin = new java.sql.Date(fechafin.getTime());
                    modeltableAnexoActivacion.getAnexoActivacion(row).setFechaFin(fin);
                    chkEstado.setSelected(false);
                    //modeltableAnexoActivacion.fireTableDataChanged();
                }
            } else {
                JOptionPane.showMessageDialog(this, "Seleccione un Registro");
            }
        }
        if (btn_ActivarPadron == e.getSource()) {
            FormAnexoPadron frmProveedorPadron = new FormAnexoPadron(this, path, btn_ActivarPadron, 1, modeltableProveedorPadron);
            frmProveedorPadron = null;
        }
        if (btn_DesactivarPadron == e.getSource()) {
            desactivarPadron();
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getSource() == txt_NumDoc) {
            if (String.valueOf(cbo_TipoDocIden.getSelectedItem()).equalsIgnoreCase("RUC")) {
                if (txt_NumDoc.getText().length() == 1 || txt_NumDoc.getText().length() == 11) {
                    char val = txt_NumDoc.getText().charAt(0);
                    if (val == '1') {
                        txt_ApePaterno.setEnabled(true);
                        txt_ApeMaterno.setEnabled(true);
                        txt_Nombre.setEnabled(true);
                        txt_Descripcion.setEnabled(false);
                        rb_SexoMasculino.setEnabled(true);
                        rb_SexoFemenino.setEnabled(true);
                        lbl_Descripcion.setVisible(false);
                        txt_Descripcion.setVisible(false);
                        lbl_Sexo.setVisible(true);
                        panelSexo.setVisible(true);
                    } else if (val == '2') {
                        txt_ApePaterno.setEnabled(false);
                        txt_ApeMaterno.setEnabled(false);
                        txt_Nombre.setEnabled(false);
                        txt_Descripcion.setEnabled(true);
                        //txt_NumDoc.setText(null);
                        rb_SexoMasculino.setEnabled(false);
                        rb_SexoFemenino.setEnabled(false);
                        lbl_Descripcion.setVisible(true);
                        txt_Descripcion.setVisible(true);
                        lbl_Sexo.setVisible(false);
                        panelSexo.setVisible(false);
                        txt_NumDoc.requestFocus();
                    } else {
                        JOptionPane.showMessageDialog(null, "EL DOCUMENTO RUC EMPIEZA CON 1 Ó 2");
                        txt_ApePaterno.setEnabled(false);
                        txt_ApeMaterno.setEnabled(false);
                        txt_Nombre.setEnabled(false);
                        txt_Descripcion.setEnabled(true);
                        rb_SexoMasculino.setEnabled(false);
                        rb_SexoFemenino.setEnabled(false);
                        lbl_Descripcion.setVisible(true);
                        txt_Descripcion.setVisible(true);
                        lbl_Sexo.setVisible(false);
                        panelSexo.setVisible(false);
                        txt_NumDoc.setText(null);
                    }
                }
            }
        }

        if (e.getSource() == txt_ApeMaterno || e.getSource() == txt_ApePaterno || e.getSource() == txt_Nombre) {
            String descripcionT = txt_ApePaterno.getText().trim() + " " + txt_ApeMaterno.getText().trim() + " " + txt_Nombre.getText().trim();
            txt_Descripcion.setText(descripcionT);
        }

        if (e.getKeyChar() != '\n') {
        }

    }

    @Override
    public void windowOpened(WindowEvent e) {
    }

    @Override
    public void windowClosing(WindowEvent e) {
    }

    @Override
    public void windowClosed(WindowEvent e) {
    }

    @Override
    public void windowIconified(WindowEvent e) {
    }

    @Override
    public void windowDeiconified(WindowEvent e) {
    }

    @Override
    public void windowActivated(WindowEvent e) {
    }

    @Override
    public void windowDeactivated(WindowEvent e) {
    }

    @Override
    public void mouseClicked(MouseEvent e) {
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
    public void focusGained(FocusEvent e) {
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_NumDoc) {
            if (String.valueOf(cbo_TipoDocIden.getSelectedItem()).equalsIgnoreCase("RUC")) {
            }
        }
    }

    @Override
    public void tableChanged(TableModelEvent e) {
    }

    @Override
    public void valueChanged(ListSelectionEvent e) {
    }
}
