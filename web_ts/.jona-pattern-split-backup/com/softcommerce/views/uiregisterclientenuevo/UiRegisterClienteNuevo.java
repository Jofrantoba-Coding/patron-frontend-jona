/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiregisterclientenuevo;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.ClasifCliente;
import com.softcommerce.beans.BeanCliente;
import com.softcommerce.beans.AnexoActivacion;
import com.softcommerce.beans.ClienteContacto;
import com.softcommerce.beans.ClienteCredito;
import com.softcommerce.beans.ClienteCuenta;
import com.softcommerce.beans.ClienteDireccion;
import com.softcommerce.beans.AnexoPadron;
import com.softcommerce.beans.ClienteSustituto;
import com.softcommerce.beans.Nacionalidad;
import com.softcommerce.beans.BeanTipoDocIden;
import com.softcommerce.beans.Usuario;
import com.softcommerce.enums.CondicionPagoEnum;
import com.softcommerce.enums.OperacionBDEnum;
import com.softcommerce.general.controles.CRadioButton;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.ObjectItem;
import com.softcommerce.general.controles.UpperCaseDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.AnexoActivacionTableModel;
import com.softcommerce.general.tablas.ClienteContactoTableModel;
import com.softcommerce.general.tablas.ClienteCreditoTableModel;
import com.softcommerce.general.tablas.ClienteCuentaTableModel;
import com.softcommerce.general.tablas.ClienteDireccionTableModel;
import com.softcommerce.general.tablas.AnexoPadronTableModel;
import com.softcommerce.general.tablas.ClienteSustitutoTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.rn_ClasifCliente;
import com.softcommerce.reglasnegocio.RnCliente;
import com.softcommerce.reglasnegocio.RnNacionalidad;
import com.softcommerce.reglasnegocio.RnTipoDocIden;
import com.softcommerce.util.Constans;
import com.softcommerce.util.render.CellRendererImageEstado;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.combo.LoadComboItem;
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
import java.math.BigDecimal;
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
import javax.swing.RowFilter;
import javax.swing.SwingConstants;
import javax.swing.border.LineBorder;
import javax.swing.table.TableRowSorter;
import org.apache.log4j.Logger;

public class UiRegisterClienteNuevo
        extends JHDialog
        implements InterUiRegisterClienteNuevo, ActionListener, ItemListener, KeyListener, FocusListener {

    private final Usuario usuario;
    private Gif gif;
    private JTabbedPane tabb;
    private JTextField txtCodigo;
    private JComboBox cboTipoDocIden;
    private List<BeanTipoDocIden> xTipoDocIden;
    private JTextField txtNumDoc;
    private JTextField txtApePaterno;
    private JTextField txtApeMaterno;
    private JTextField txtNombre;
    private JTextField txtDescripcion;
    private JLabel lblDescripcion;
    private JTextField txtDireccion;
    private JTextField txtCredito;
    private JTextField txtCreditoTemp;
    private JLabel lblSexo;
    private JPanel panelSexo;
    private CRadioButton rbSexoMasculino;
    private CRadioButton rbSexoFemenino;
    private ButtonGroup bgSexo;
    private JTextField txtTelFijo;
    private JTextField txtTelMovil;
    private JComboBox cboNacionalidad;
    private List<Nacionalidad> xNacionalidad;
    private JComboBox cboClasifCliente;
    private List<ClasifCliente> xClasifCliente;
    private JTextField txtEmail;
    private JCheckBox chkAgpercepcion;
    private JCheckBox chkAgretencion;
    private JCheckBox chkExeptuado;
    private JCheckBox chkEstado;
    //Activacion de Cliente
    private JButton btnActivarCliente;
    private JButton btnDesactivarCliente;
    private CTable tableAnexoActivacion;
    private AnexoActivacionTableModel modeltableAnexoActivacion;
    private TableRowSorter modeloOrdenadoAnexoActivacion;
    private JScrollPane scrollAnexoActivacion;
    //Direcciones de Cliente
    private JButton btnAgregarDireccion;
    private JButton btnQuitarDireccion;
    private CTable tableClienteDireccion;
    private ClienteDireccionTableModel modeltableClienteDireccion;
    private JScrollPane scrollClienteDireccion;
    //Padrones de Cliente
    private JButton btnActivarPadron;
    private JButton btnDesactivarPadron;
    private CTable tableClientePadron;
    public AnexoPadronTableModel modeltableClientePadron;
    private TableRowSorter modeloOrdenadoClientePadron;
    private JScrollPane scrollClientePadron;
    //Contactos de Cliente
    private JButton btnAgregarContacto;
    private JButton btnQuitarContacto;
    private CTable tableClienteContacto;
    private ClienteContactoTableModel modeltableClienteContacto;
    private TableRowSorter modeloOrdenadoClienteContacto;
    private JScrollPane scrollClienteContacto;
    //Cuenta de Cliente
    private JButton btnAgregarCuenta;
    private JButton btnQuitarCuenta;
    private CTable tableClienteCuenta;
    private ClienteCuentaTableModel modeltableClienteCuenta;
    private TableRowSorter modeloOrdenadoClienteCuenta;
    private JScrollPane scrollClienteCuenta;
    //Clientes Sustitutos
    private JButton btnAgregarSustituto;
    private JButton btnActivarSustituto;
    private JButton btnDesactivarSustituto;
    private CTable tableClienteSustituto;
    public ClienteSustitutoTableModel modeltableClienteSustituto;
    private TableRowSorter modeloOrdenadoClienteSustituto;
    private JScrollPane scrollClienteSustituto;
    //Credito
    private JButton btnActivarCredito;
    private JButton btnDesactivarCredito;
    private CTable tableClienteCredito;
    public ClienteCreditoTableModel modeltableClienteCredito;
    private TableRowSorter modeloOrdenadoClienteCredito;
    private JScrollPane scrollClienteCredito;
    //Credito
    private JButton btnActivarCreditoTemp;
    private JButton btnDesactivarCreditoTemp;
    private CTable tableClienteCreditoTemp;
    public ClienteCreditoTableModel modeltableClienteCreditoTemp;
    private TableRowSorter modeloOrdenadoClienteCreditoTemp;
    private JScrollPane scrollClienteCreditoTemp;
    //
    private JTextField txtNumero;
    private JTextField txtRazonSocial;
    private final Logger logger = Logger.getLogger(UiRegisterClienteNuevo.class);
    //
    private JTextField txtNumDias;
    private JComboBox cboCondicionPago;

    public UiRegisterClienteNuevo(Frame arg0, Usuario usuario) {
        super(arg0, true);
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    public UiRegisterClienteNuevo(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    private void inicialize() {
        gif = new Gif();

        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245, 245, 245));

        tabb = new JTabbedPane();
        tabb.addKeyListener(this);
        tabb.addFocusListener(this);

        tabb.addTab("General", getPanelDatosGeneral());
        tabb.addTab("Activación de Cliente", getPanelActivacion());
        tabb.addTab("Direcciones", getPanelDireccion());
        JPanel pnlSustituto = getPanelSustitutos();
        if (Constans.IS_CLIENTE_SUSTITUTO) {
            tabb.addTab("Sustitutos", pnlSustituto);
        }
        JPanel pnlCredito = getPanelCredito();
        JPanel pnlCreditoTemp = getPanelCreditoTemp();
        if (Constans.IS_CLIENTE_CREDITO) {
            tabb.addTab("Credito", pnlCredito);
            tabb.addTab("Credito Temp", pnlCreditoTemp);
        }
        tabb.addTab("Padrones", getPanelPadrones());
        tabb.addTab("Contactos", getPanelContactos());
        tabb.addTab("Cuentas", getPanelCuentas());

        pnl_dialog.add(tabb);

        tabb.setBounds(10, 10, 815, 430);
        pnl_dialog.add(tabb);

        setTitleName("Cliente");
        setRegister(pnl_dialog);
        setSize(new Dimension(860, 530));
        ComponentToolKit.centerComponentPosicion(this);
    }

    private void initListener() {
        txtNumero.addKeyListener(this);
        txtNumero.addFocusListener(this);
        txtRazonSocial.addKeyListener(this);
        txtRazonSocial.addFocusListener(this);
        cboCondicionPago.addItemListener(this);
        cboTipoDocIden.addItemListener(this);
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
        gbc.insets = new Insets(2, 2, 2, 2);
        pnlGeneral.add(lbl_Codigo, gbc);

        txtCodigo = new JTextField();
        txtCodigo.setEnabled(false);
        txtCodigo.addKeyListener(this);
        gbc.gridx = 1;
        pnlGeneral.add(txtCodigo, gbc);

        JLabel lbl_TipoDocIden = new JLabel("Tipo de Documento");
        gbc.gridx = 0;
        gbc.gridy = 1;
        pnlGeneral.add(lbl_TipoDocIden, gbc);

        cboTipoDocIden = new JComboBox();
        cboTipoDocIden.setFont(new Font(Font.SANS_SERIF, 0, 9));
        gbc.gridx = 1;
        pnlGeneral.add(cboTipoDocIden, gbc);

        JLabel lbl_NumDoc = new JLabel("DNI/RUC");
        gbc.gridx = 2;
        pnlGeneral.add(lbl_NumDoc, gbc);

        txtNumDoc = new JTextField();
        txtNumDoc.setDocument(new IntegerDocument(11));
        txtNumDoc.addFocusListener(this);
        txtNumDoc.addKeyListener(this);
        txtNumDoc.setColumns(10);
        gbc.gridx = 3;
        pnlGeneral.add(txtNumDoc, gbc);

        JLabel lbl_ApePaterno = new JLabel("Apellido Paterno");
        gbc.gridx = 0;
        gbc.gridy = 2;
        pnlGeneral.add(lbl_ApePaterno, gbc);

        txtApePaterno = new JTextField();
        txtApePaterno.addFocusListener(this);
        txtApePaterno.setDocument(new UpperCaseDocument(50));
        txtApePaterno.addKeyListener(this);
        gbc.gridx = 1;
        pnlGeneral.add(txtApePaterno, gbc);
        JLabel lbl_ApeMaterno = new JLabel("Apellido Materno");
        gbc.gridx = 2;
        pnlGeneral.add(lbl_ApeMaterno, gbc);
        txtApeMaterno = new JTextField();
        txtApeMaterno.setDocument(new UpperCaseDocument(50));
        txtApeMaterno.addFocusListener(this);
        txtApeMaterno.addKeyListener(this);
        gbc.gridx = 3;
        pnlGeneral.add(txtApeMaterno, gbc);

        JLabel lbl_Nombre = new JLabel("Nombres");
        gbc.gridx = 0;
        gbc.gridy = 3;
        pnlGeneral.add(lbl_Nombre, gbc);

        txtNombre = new JTextField();
        txtNombre.addFocusListener(this);
        txtNombre.setDocument(new UpperCaseDocument(50));
        txtNombre.addKeyListener(this);
        gbc.gridx = 1;
        pnlGeneral.add(txtNombre, gbc);

        lblDescripcion = new JLabel("Razón Social");
        gbc.gridx = 0;
        gbc.gridy = 4;
        pnlGeneral.add(lblDescripcion, gbc);

        txtDescripcion = new JTextField();
        txtDescripcion.addKeyListener(this);
        txtDescripcion.addFocusListener(this);
        txtDescripcion.setDocument(new UpperCaseNumberDocument(300));
        gbc.gridx = 1;
        pnlGeneral.add(txtDescripcion, gbc);

        JLabel lbl_Direccion = new JLabel("Dirección");
        gbc.gridx = 0;
        gbc.gridy = 5;
        pnlGeneral.add(lbl_Direccion, gbc);

        txtDireccion = new JTextField();
        txtDireccion.setDocument(new UpperCaseNumberDocument(280));
        txtDireccion.addKeyListener(this);
        txtDireccion.addFocusListener(this);
        gbc.gridx = 1;
        pnlGeneral.add(txtDireccion, gbc);

        txtCredito = new JTextField();
        txtCredito.setDocument(new DoubleDocument());
        txtCredito.setEditable(false);
        gbc.gridx = 2;
        //pnlGeneral.add(txtCredito, gbc);

        txtCreditoTemp = new JTextField();
        txtCreditoTemp.setDocument(new DoubleDocument());
        txtCreditoTemp.setEnabled(false);
        gbc.gridx = 3;
        //pnlGeneral.add(txtCreditoTemp, gbc);

        FlowLayout flow = new FlowLayout(FlowLayout.LEFT);
        panelSexo = new JPanel();
        panelSexo.setLayout(flow);
        lblSexo = new JLabel("Sexo");
        gbc.gridx = 0;
        gbc.gridy = 6;
        pnlGeneral.add(lblSexo, gbc);

        rbSexoFemenino = new CRadioButton("Femenino");
        rbSexoFemenino.addKeyListener(this);
        panelSexo.add(rbSexoFemenino);

        rbSexoMasculino = new CRadioButton("Masculino");
        rbSexoMasculino.addKeyListener(this);
        panelSexo.add(rbSexoMasculino);
        gbc.gridx = 1;
        gbc.gridwidth = 2;
        pnlGeneral.add(panelSexo, gbc);

        bgSexo = new ButtonGroup();
        bgSexo.add(rbSexoFemenino);
        bgSexo.add(rbSexoMasculino);

        JLabel lbl_TelFijo = new JLabel("Telefono Fijo");
        gbc.gridx = 0;
        gbc.gridy = 7;
        gbc.gridwidth = 1;
        pnlGeneral.add(lbl_TelFijo, gbc);

        txtTelFijo = new JTextField();
        txtTelFijo.setDocument(new IntegerDocument(15));
        txtTelFijo.addKeyListener(this);
        txtTelFijo.addFocusListener(this);
        gbc.gridx = 1;
        pnlGeneral.add(txtTelFijo, gbc);

        JLabel lbl_TelMovil = new JLabel("Telefono Movil");
        gbc.gridx = 2;
        pnlGeneral.add(lbl_TelMovil, gbc);

        txtTelMovil = new JTextField();
        txtTelMovil.setDocument(new IntegerDocument(15));
        txtTelMovil.addKeyListener(this);
        txtTelMovil.addFocusListener(this);
        gbc.gridx = 3;
        pnlGeneral.add(txtTelMovil, gbc);

        JLabel lbl_TipoCliente = new JLabel("Tipo Cliente");
        gbc.gridx = 0;
        gbc.gridy = 8;
        pnlGeneral.add(lbl_TipoCliente, gbc);

        cboClasifCliente = new JComboBox();
        cboClasifCliente.setFont(new Font(Font.SANS_SERIF, 0, 9));
        cboClasifCliente.addKeyListener(this);
        gbc.gridx = 1;
        pnlGeneral.add(cboClasifCliente, gbc);

        JLabel lbl_Nacionalidad = new JLabel("Nacionalidad");
        gbc.gridx = 2;
        pnlGeneral.add(lbl_Nacionalidad, gbc);

        cboNacionalidad = new JComboBox();
        cboNacionalidad.setFont(new Font(Font.SANS_SERIF, 0, 9));
        cboNacionalidad.addKeyListener(this);
        gbc.gridx = 3;
        pnlGeneral.add(cboNacionalidad, gbc);

        JLabel lbl_Email = new JLabel("E-Mail");
        gbc.gridx = 0;
        gbc.gridy = 9;
        pnlGeneral.add(lbl_Email, gbc);

        txtEmail = new JTextField();
        txtEmail.addKeyListener(this);
        txtEmail.addFocusListener(this);
        gbc.gridx = 1;
        pnlGeneral.add(txtEmail, gbc);

        chkEstado = new JCheckBox("Estado");
        chkEstado.setEnabled(false);
        gbc.gridx = 2;
        pnlGeneral.add(chkEstado, gbc);

        gbc.gridy = 10;

        JLabel lblCondicionPago = new JLabel("Condicion Pago");
        cboCondicionPago = new JComboBox();
        JLabel lblNumeroDias = new JLabel("Condicion Pago");
        txtNumDias = new JTextField();
        if (Constans.IS_CLIENTE_CONDICION_PAGO) {
            gbc.gridx = 0;
            pnlGeneral.add(lblCondicionPago, gbc);
            gbc.gridx = 1;
            pnlGeneral.add(cboCondicionPago, gbc);
            gbc.gridx = 2;
            pnlGeneral.add(lblNumeroDias, gbc);
            gbc.gridx = 3;
            txtNumDias.setColumns(4);
            txtNumDias.setDocument(new IntegerDocument(3));
            txtNumDias.setText("0");
            txtNumDias.setEnabled(false);
            pnlGeneral.add(txtNumDias, gbc);
            this.loadCondicionPago();
        }

        JPanel panelPatrones = new JPanel();
        panelPatrones.setLayout(flow);
        chkAgpercepcion = new JCheckBox("A Percepcion");
        chkAgpercepcion.addKeyListener(this);
        chkAgpercepcion.setHorizontalTextPosition(SwingConstants.LEFT);
        chkAgpercepcion.addFocusListener(this);
        chkAgpercepcion.addItemListener(this);
        chkAgpercepcion.setOpaque(false);
        chkAgpercepcion.setEnabled(false);
        panelPatrones.add(chkAgpercepcion);
        chkAgretencion = new JCheckBox("A Retencion");
        chkAgretencion.addKeyListener(this);
        chkAgretencion.setHorizontalTextPosition(SwingConstants.LEFT);
        chkAgretencion.addFocusListener(this);
        chkAgretencion.addItemListener(this);
        chkAgretencion.setOpaque(false);
        chkAgretencion.setEnabled(false);
        panelPatrones.add(chkAgretencion);

        chkExeptuado = new JCheckBox("Exceptuado");
        chkExeptuado.addKeyListener(this);
        chkExeptuado.setHorizontalTextPosition(SwingConstants.LEFT);
        chkExeptuado.addFocusListener(this);
        chkExeptuado.addItemListener(this);
        chkExeptuado.setOpaque(false);
        chkExeptuado.setEnabled(false);
        panelPatrones.add(chkExeptuado);

        gbc.gridx = 0;
        gbc.gridy = 11;
        gbc.gridwidth = 3;
        pnlGeneral.add(panelPatrones, gbc);

        return pnlGeneral;
    }

    private void loadCondicionPago() {
        cboCondicionPago.addItem(new ObjectItem(Constans.ITEM_INIT, null));
        for (CondicionPagoEnum tcEnum : CondicionPagoEnum.values()) {
            cboCondicionPago.addItem(new ObjectItem(tcEnum.name(), tcEnum.getValue()));
        }
    }

    private JPanel getPanelActivacion() {
        JPanel pnlActivacion = new JPanel(new BorderLayout());
        pnlActivacion.setLayout(new BorderLayout(0, 0));
        pnlActivacion.setBackground(new Color(245, 245, 245));
        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setPreferredSize(new Dimension(0, 30));

        btnActivarCliente = new JButton("Activar", gif.ADD16);
        btnActivarCliente.setMnemonic('A');
        btnActivarCliente.setHorizontalAlignment(SwingConstants.LEFT);
        btnActivarCliente.setIconTextGap(10);
        btnActivarCliente.addActionListener(this);
        btnActivarCliente.setOpaque(false);
        btnActivarCliente.addKeyListener(this);
        btnActivarCliente.setFocusPainted(false);
        btnActivarCliente.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnActivarCliente);

        toolbar.addSeparator();

        btnDesactivarCliente = new JButton("Desactivar", gif.ELIMINATE16);
        btnDesactivarCliente.setMnemonic('D');
        btnDesactivarCliente.setHorizontalAlignment(SwingConstants.LEFT);
        btnDesactivarCliente.setIconTextGap(10);
        btnDesactivarCliente.addActionListener(this);
        btnDesactivarCliente.setOpaque(false);
        btnDesactivarCliente.addKeyListener(this);
        btnDesactivarCliente.setFocusPainted(false);
        btnDesactivarCliente.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnDesactivarCliente);

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
        scrollAnexoActivacion = new JScrollPane(tableAnexoActivacion);
        scrollAnexoActivacion.setPreferredSize(new Dimension(1200, 380));

        pnlActivacion.add(scrollAnexoActivacion, BorderLayout.CENTER);

        return pnlActivacion;
    }

    private JPanel getPanelDireccion() {
        JPanel pnlDireccion = new JPanel(new BorderLayout());
        pnlDireccion.setLayout(new BorderLayout(0, 0));
        pnlDireccion.setBackground(new Color(245, 245, 245));

        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setPreferredSize(new Dimension(0, 30));

        btnAgregarDireccion = new JButton("Agregar", gif.ADD16);
        btnAgregarDireccion.setMnemonic('A');
        btnAgregarDireccion.setHorizontalAlignment(SwingConstants.LEFT);
        btnAgregarDireccion.setIconTextGap(10);
        btnAgregarDireccion.addActionListener(this);
        btnAgregarDireccion.setOpaque(false);
        btnAgregarDireccion.addKeyListener(this);
        btnAgregarDireccion.setFocusPainted(false);
        btnAgregarDireccion.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnAgregarDireccion);

        toolbar.addSeparator();

        btnQuitarDireccion = new JButton("Quitar", gif.ELIMINATE16);
        btnQuitarDireccion.setMnemonic('Q');
        btnQuitarDireccion.setHorizontalAlignment(SwingConstants.LEFT);
        btnQuitarDireccion.setIconTextGap(10);
        btnQuitarDireccion.addActionListener(this);
        btnQuitarDireccion.setOpaque(false);
        btnQuitarDireccion.addKeyListener(this);
        btnQuitarDireccion.setFocusPainted(false);
        btnQuitarDireccion.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnQuitarDireccion);

        pnlDireccion.add(toolbar, BorderLayout.NORTH);

        modeltableClienteDireccion = new ClienteDireccionTableModel();
        tableClienteDireccion = new CTable();
        tableClienteDireccion.setModel(modeltableClienteDireccion);
        tableClienteDireccion.setAllTableNoEditable();
        tableClienteDireccion.setAllColumnNoResizable();
        tableClienteDireccion.setRendererColumnZero();
        tableClienteDireccion.setAllColumnPreferredWidth();
        scrollClienteDireccion = new JScrollPane(tableClienteDireccion);
        scrollClienteDireccion.setPreferredSize(new Dimension(1200, 380));

        pnlDireccion.add(scrollClienteDireccion, BorderLayout.CENTER);

        return pnlDireccion;
    }

    private JPanel getPanelSustitutos() {
        JPanel pnlSustitutos = new JPanel(new BorderLayout());
        pnlSustitutos.setLayout(new BorderLayout(0, 0));
        pnlSustitutos.setBackground(new Color(245, 245, 245));

        JPanel pnlSustitutosCab = new JPanel(new BorderLayout());
        pnlSustitutosCab.setLayout(new BorderLayout(0, 0));
        pnlSustitutosCab.setBackground(new Color(245, 245, 245));

        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setPreferredSize(new Dimension(0, 30));

        btnAgregarSustituto = new JButton("Agregar", gif.ADD16);
        btnAgregarSustituto.setMnemonic('A');
        btnAgregarSustituto.setHorizontalAlignment(SwingConstants.LEFT);
        btnAgregarSustituto.setIconTextGap(10);
        btnAgregarSustituto.addActionListener(this);
        btnAgregarSustituto.setOpaque(false);
        btnAgregarSustituto.addKeyListener(this);
        btnAgregarSustituto.setFocusPainted(false);
        btnAgregarSustituto.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnAgregarSustituto);

        toolbar.addSeparator();

        btnActivarSustituto = new JButton("Activar", gif.MODIFY16);
        btnActivarSustituto.setMnemonic('T');
        btnActivarSustituto.setHorizontalAlignment(SwingConstants.LEFT);
        btnActivarSustituto.setIconTextGap(10);
        btnActivarSustituto.addActionListener(this);
        btnActivarSustituto.setOpaque(false);
        btnActivarSustituto.addKeyListener(this);
        btnActivarSustituto.setFocusPainted(false);
        btnActivarSustituto.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnActivarSustituto);

        toolbar.addSeparator();

        btnDesactivarSustituto = new JButton("Desactivar", gif.ELIMINATE16);
        btnDesactivarSustituto.setMnemonic('D');
        btnDesactivarSustituto.setHorizontalAlignment(SwingConstants.LEFT);
        btnDesactivarSustituto.setIconTextGap(10);
        btnDesactivarSustituto.addActionListener(this);
        btnDesactivarSustituto.setOpaque(false);
        btnDesactivarSustituto.addKeyListener(this);
        btnDesactivarSustituto.setFocusPainted(false);
        btnDesactivarSustituto.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnDesactivarSustituto);

        pnlSustitutosCab.add(toolbar, BorderLayout.NORTH);
        JPanel pnlSustitutosFiltro = new JPanel(new FlowLayout(FlowLayout.LEADING, 5, 5));
        pnlSustitutosFiltro.setBackground(new Color(245, 245, 245));

        JLabel lblNumDoc = new JLabel("N° Doc: ");
        pnlSustitutosFiltro.add(lblNumDoc);

        txtNumero = new JTextField();
        txtNumero.setDocument(new IntegerDocument(11));
        txtNumero.setColumns(10);
        pnlSustitutosFiltro.add(txtNumero);

        JLabel lblDescripcionLcl = new JLabel("  Razon Social: ");
        pnlSustitutosFiltro.add(lblDescripcionLcl);

        txtRazonSocial = new JTextField();
        txtRazonSocial.setDocument(new UpperCaseNumberDocument(300));
        txtRazonSocial.setColumns(20);
        pnlSustitutosFiltro.add(txtRazonSocial);

        pnlSustitutosCab.add(pnlSustitutosFiltro, BorderLayout.CENTER);

        pnlSustitutos.add(pnlSustitutosCab, BorderLayout.NORTH);

        modeltableClienteSustituto = new ClienteSustitutoTableModel();
        modeloOrdenadoClienteSustituto = new TableRowSorter(modeltableClienteSustituto);
        tableClienteSustituto = new CTable();
        tableClienteSustituto.setRowSorter(modeloOrdenadoClienteSustituto);
        tableClienteSustituto.setModel(modeltableClienteSustituto);
        tableClienteSustituto.setAllTableNoEditable();
        tableClienteSustituto.setAllColumnNoResizable();
        tableClienteSustituto.setRendererColumnZero();
        tableClienteSustituto.setAllColumnPreferredWidth();
        tableClienteSustituto.setNoVisibleColumn(0);
        tableClienteSustituto.setNoVisibleColumn(1);
        tableClienteSustituto.setNoVisibleColumn(10);
        tableClienteSustituto.setNoVisibleColumn(11);
        scrollClienteSustituto = new JScrollPane(tableClienteSustituto);
        scrollClienteSustituto.setPreferredSize(new Dimension(1200, 380));
        pnlSustitutos.add(scrollClienteSustituto, BorderLayout.CENTER);

        return pnlSustitutos;
    }

    private JPanel getPanelPadrones() {
        JPanel pnlPadrones = new JPanel(new BorderLayout());
        pnlPadrones.setLayout(new BorderLayout(0, 0));
        pnlPadrones.setBackground(new Color(245, 245, 245));
        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setPreferredSize(new Dimension(0, 30));

        btnActivarPadron = new JButton("Activar", gif.ADD16);
        btnActivarPadron.setMnemonic('A');
        btnActivarPadron.setHorizontalAlignment(SwingConstants.LEFT);
        btnActivarPadron.setIconTextGap(10);
        btnActivarPadron.addActionListener(this);
        btnActivarPadron.setOpaque(false);
        btnActivarPadron.addKeyListener(this);
        btnActivarPadron.setFocusPainted(false);
        btnActivarPadron.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnActivarPadron);

        toolbar.addSeparator();

        btnDesactivarPadron = new JButton("Desactivar", gif.ELIMINATE16);
        btnDesactivarPadron.setMnemonic('D');
        btnDesactivarPadron.setHorizontalAlignment(SwingConstants.LEFT);
        btnDesactivarPadron.setIconTextGap(10);
        btnDesactivarPadron.addActionListener(this);
        btnDesactivarPadron.setOpaque(false);
        btnDesactivarPadron.addKeyListener(this);
        btnDesactivarPadron.setFocusPainted(false);
        btnDesactivarPadron.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnDesactivarPadron);

        pnlPadrones.add(toolbar, BorderLayout.NORTH);

        modeltableClientePadron = new AnexoPadronTableModel();
        modeloOrdenadoClientePadron = new TableRowSorter(modeltableClientePadron);
        tableClientePadron = new CTable();
        tableClientePadron.setRowSorter(modeloOrdenadoClientePadron);
        tableClientePadron.setModel(modeltableClientePadron);
        tableClientePadron.setAllTableNoEditable();
        tableClientePadron.setAllColumnNoResizable();
        tableClientePadron.setRendererColumnZero();
        tableClientePadron.setAllColumnPreferredWidth();
        scrollClientePadron = new JScrollPane(tableClientePadron);
        scrollClientePadron.setPreferredSize(new Dimension(1200, 380));

        pnlPadrones.add(scrollClientePadron, BorderLayout.CENTER);
        return pnlPadrones;
    }

    private JPanel getPanelContactos() {
        JPanel pnlContactos = new JPanel(new BorderLayout());
        pnlContactos.setLayout(new BorderLayout(0, 0));
        pnlContactos.setBackground(new Color(245, 245, 245));
        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setPreferredSize(new Dimension(0, 30));

        btnAgregarContacto = new JButton("Agregar", gif.ADD16);
        btnAgregarContacto.setMnemonic('A');
        btnAgregarContacto.setHorizontalAlignment(SwingConstants.LEFT);
        btnAgregarContacto.setIconTextGap(10);
        btnAgregarContacto.addActionListener(this);
        btnAgregarContacto.setOpaque(false);
        btnAgregarContacto.addKeyListener(this);
        btnAgregarContacto.setFocusPainted(false);
        btnAgregarContacto.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnAgregarContacto);

        toolbar.addSeparator();

        btnQuitarContacto = new JButton("Quitar", gif.ELIMINATE16);
        btnQuitarContacto.setMnemonic('Q');
        btnQuitarContacto.setHorizontalAlignment(SwingConstants.LEFT);
        btnQuitarContacto.setIconTextGap(10);
        btnQuitarContacto.addActionListener(this);
        btnQuitarContacto.setOpaque(false);
        btnQuitarContacto.addKeyListener(this);
        btnQuitarContacto.setFocusPainted(false);
        btnQuitarContacto.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnQuitarContacto);

        pnlContactos.add(toolbar, BorderLayout.NORTH);

        modeltableClienteContacto = new ClienteContactoTableModel();
        modeloOrdenadoClienteContacto = new TableRowSorter(modeltableClienteContacto);
        tableClienteContacto = new CTable();
        tableClienteContacto.setRowSorter(modeloOrdenadoClienteContacto);
        tableClienteContacto.setModel(modeltableClienteContacto);
        tableClienteContacto.setAllTableNoEditable();
        tableClienteContacto.setAllColumnNoResizable();
        tableClienteContacto.setRendererColumnZero();
        tableClienteContacto.setAllColumnPreferredWidth();
        scrollClienteContacto = new JScrollPane(tableClienteContacto);
        scrollClienteContacto.setPreferredSize(new Dimension(1200, 380));

        pnlContactos.add(scrollClienteContacto, BorderLayout.CENTER);

        return pnlContactos;
    }

    private JPanel getPanelCuentas() {
        JPanel pnlCuentas = new JPanel(new BorderLayout());
        pnlCuentas.setLayout(new BorderLayout(0, 0));
        pnlCuentas.setBackground(new Color(245, 245, 245));

        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setPreferredSize(new Dimension(0, 30));

        btnAgregarCuenta = new JButton("Agregar", gif.ADD16);
        btnAgregarCuenta.setMnemonic('A');
        btnAgregarCuenta.setHorizontalAlignment(SwingConstants.LEFT);
        btnAgregarCuenta.setIconTextGap(10);
        btnAgregarCuenta.addActionListener(this);
        btnAgregarCuenta.setOpaque(false);
        btnAgregarCuenta.addKeyListener(this);
        btnAgregarCuenta.setFocusPainted(false);
        btnAgregarCuenta.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnAgregarCuenta);

        toolbar.addSeparator();

        btnQuitarCuenta = new JButton("Quitar", gif.ELIMINATE16);
        btnQuitarCuenta.setMnemonic('Q');
        btnQuitarCuenta.setHorizontalAlignment(SwingConstants.LEFT);
        btnQuitarCuenta.setIconTextGap(10);
        btnQuitarCuenta.addActionListener(this);
        btnQuitarCuenta.setOpaque(false);
        btnQuitarCuenta.addKeyListener(this);
        btnQuitarCuenta.setFocusPainted(false);
        btnQuitarCuenta.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnQuitarCuenta);

        pnlCuentas.add(toolbar, BorderLayout.NORTH);

        modeltableClienteCuenta = new ClienteCuentaTableModel();
        modeloOrdenadoClienteCuenta = new TableRowSorter(modeltableClienteCuenta);
        tableClienteCuenta = new CTable();
        tableClienteCuenta.setRowSorter(modeloOrdenadoClienteCuenta);
        tableClienteCuenta.setModel(modeltableClienteCuenta);
        tableClienteCuenta.setAllTableNoEditable();
        tableClienteCuenta.setAllColumnNoResizable();
        tableClienteCuenta.setRendererColumnZero();
        tableClienteCuenta.setAllColumnPreferredWidth();
        scrollClienteCuenta = new JScrollPane(tableClienteCuenta);
        scrollClienteCuenta.setPreferredSize(new Dimension(1200, 380));

        pnlCuentas.add(scrollClienteCuenta, BorderLayout.CENTER);

        return pnlCuentas;
    }

    private JPanel getPanelCredito() {
        JPanel pnlCredito = new JPanel(new BorderLayout());
        pnlCredito.setLayout(new BorderLayout(0, 0));
        pnlCredito.setBackground(new Color(245, 245, 245));

        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setPreferredSize(new Dimension(0, 30));

        btnActivarCredito = new JButton("Activar", gif.ADD16);
        btnActivarCredito.setMnemonic('A');
        btnActivarCredito.setHorizontalAlignment(SwingConstants.LEFT);
        btnActivarCredito.setIconTextGap(10);
        btnActivarCredito.addActionListener(this);
        btnActivarCredito.setOpaque(false);
        btnActivarCredito.addKeyListener(this);
        btnActivarCredito.setFocusPainted(false);
        btnActivarCredito.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnActivarCredito);

        toolbar.addSeparator();

        btnDesactivarCredito = new JButton("Desactivar", gif.ELIMINATE16);
        btnDesactivarCredito.setMnemonic('D');
        btnDesactivarCredito.setHorizontalAlignment(SwingConstants.LEFT);
        btnDesactivarCredito.setIconTextGap(10);
        btnDesactivarCredito.addActionListener(this);
        btnDesactivarCredito.setOpaque(false);
        btnDesactivarCredito.addKeyListener(this);
        btnDesactivarCredito.setFocusPainted(false);
        btnDesactivarCredito.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnDesactivarCredito);

        pnlCredito.add(toolbar, BorderLayout.NORTH);

        modeltableClienteCredito = new ClienteCreditoTableModel();
        modeloOrdenadoClienteCredito = new TableRowSorter(modeltableClienteCredito);
        tableClienteCredito = new CTable();
        tableClienteCredito.setRowSorter(modeloOrdenadoClienteCredito);
        tableClienteCredito.setModel(modeltableClienteCredito);
        tableClienteCredito.setAllTableNoEditable();
        tableClienteCredito.setAllColumnNoResizable();
        tableClienteCredito.setRendererColumnZero();
        tableClienteCredito.setAllColumnPreferredWidth();
        scrollClienteCredito = new JScrollPane(tableClienteCredito);
        scrollClienteCredito.setPreferredSize(new Dimension(1200, 380));

        pnlCredito.add(scrollClienteCredito, BorderLayout.CENTER);
        return pnlCredito;
    }

    private JPanel getPanelCreditoTemp() {
        JPanel pnlCreditoTemp = new JPanel(new BorderLayout());
        pnlCreditoTemp.setLayout(new BorderLayout(0, 0));
        pnlCreditoTemp.setBackground(new Color(245, 245, 245));
        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setPreferredSize(new Dimension(0, 30));

        btnActivarCreditoTemp = new JButton("Activar", gif.ADD16);
        btnActivarCreditoTemp.setMnemonic('A');
        btnActivarCreditoTemp.setHorizontalAlignment(SwingConstants.LEFT);
        btnActivarCreditoTemp.setIconTextGap(10);
        btnActivarCreditoTemp.addActionListener(this);
        btnActivarCreditoTemp.setOpaque(false);
        btnActivarCreditoTemp.addKeyListener(this);
        btnActivarCreditoTemp.setFocusPainted(false);
        btnActivarCreditoTemp.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnActivarCreditoTemp);

        toolbar.addSeparator();

        btnDesactivarCreditoTemp = new JButton("Desactivar", gif.ELIMINATE16);
        btnDesactivarCreditoTemp.setMnemonic('D');
        btnDesactivarCreditoTemp.setHorizontalAlignment(SwingConstants.LEFT);
        btnDesactivarCreditoTemp.setIconTextGap(10);
        btnDesactivarCreditoTemp.addActionListener(this);
        btnDesactivarCreditoTemp.setOpaque(false);
        btnDesactivarCreditoTemp.addKeyListener(this);
        btnDesactivarCreditoTemp.setFocusPainted(false);
        btnDesactivarCreditoTemp.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnDesactivarCreditoTemp);

        pnlCreditoTemp.add(toolbar, BorderLayout.NORTH);

        modeltableClienteCreditoTemp = new ClienteCreditoTableModel();
        modeloOrdenadoClienteCreditoTemp = new TableRowSorter(modeltableClienteCreditoTemp);
        tableClienteCreditoTemp = new CTable();
        tableClienteCreditoTemp.setRowSorter(modeloOrdenadoClienteCreditoTemp);
        tableClienteCreditoTemp.setModel(modeltableClienteCreditoTemp);
        tableClienteCreditoTemp.setAllTableNoEditable();
        tableClienteCreditoTemp.setAllColumnNoResizable();
        tableClienteCreditoTemp.setRendererColumnZero();
        tableClienteCreditoTemp.setAllColumnPreferredWidth();
        scrollClienteCreditoTemp = new JScrollPane(tableClienteCreditoTemp);
        scrollClienteCreditoTemp.setPreferredSize(new Dimension(1200, 380));

        pnlCreditoTemp.add(scrollClienteCreditoTemp, BorderLayout.CENTER);
        return pnlCreditoTemp;
    }

    private RowFilter getFilter() {
        List filters = new ArrayList();
        if (txtNumero.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtNumero.getText().trim() + ".*", 3));
        }
        if (txtRazonSocial.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtRazonSocial.getText().trim() + ".*", 4));
        }

        RowFilter fooBarFilter = RowFilter.andFilter(filters);

        return fooBarFilter;
    }

    private void filtrar() {
        modeloOrdenadoClienteSustituto.setRowFilter(getFilter());
        tableClienteSustituto.setAllColumnPreferredWidth();

        if (tableClienteSustituto.getRowCount() > 0) {
            tableClienteSustituto.setRowSelectionInterval(0, 0);
        }
    }

    private void loadTipoDocIden() throws Exception {
        try {
            RnTipoDocIden regla_TipoDocIden = new RnTipoDocIden(path);

            if (xTipoDocIden != null) {
                xTipoDocIden.clear();
            } else {
                xTipoDocIden = new ArrayList();
            }

            xTipoDocIden = regla_TipoDocIden.listarTipoDocIden("", "A", "S");

            cboTipoDocIden.removeAllItems();
            cboTipoDocIden.addItem("--- Seleccione un Tipo de Documento de Identidad ---");

            for (int i = 0; i < xTipoDocIden.size(); i++) {
                cboTipoDocIden.addItem(xTipoDocIden.get(i).getAbreviatura());
            }

            cboTipoDocIden.setSelectedIndex(0);
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

            cboNacionalidad.removeAllItems();
            cboNacionalidad.addItem("--- Seleccione Nacionalidad ---");

            for (int i = 0; i < xNacionalidad.size(); i++) {
                cboNacionalidad.addItem(xNacionalidad.get(i).getDescripcion());
            }

            cboNacionalidad.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadClasifCliente() {
        try {
            rn_ClasifCliente regla = new rn_ClasifCliente(path);

            if (xClasifCliente != null) {
                xClasifCliente.clear();
            } else {
                xClasifCliente = new ArrayList<ClasifCliente>();
            }

            xClasifCliente = regla.listar(0);

            cboClasifCliente.removeAllItems();
            cboClasifCliente.addItem("--- Seleccione Tipo ---");

            for (int i = 0; i < xClasifCliente.size(); i++) {
                cboClasifCliente.addItem(xClasifCliente.get(i).getDescripcion());
            }
            if (xClasifCliente.size() > 0) {
                cboClasifCliente.setSelectedIndex(1);
            } else {
                cboClasifCliente.setSelectedIndex(0);
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Cliente", JOptionPane.OK_OPTION);
        }
    }

    private String getXmlActivacion(SimpleDateFormat fe) {
        String xmlActivacion = "<?xml version=\"1.0\" ?> ";
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
        return xmlActivacion;
    }

    private String getXmlDireccion() {
        String xmlDireccion = "<?xml version=\"1.0\" ?> ";
        xmlDireccion += "<DIRECCIONES>";
        for (int i = 0; i < modeltableClienteDireccion.getRowCount(); i++) {
            ClienteDireccion beanClienteDireccion = modeltableClienteDireccion.getClienteDireccion(i);
            if (!beanClienteDireccion.getOperacion().equals("")) {
                xmlDireccion += "<DIRECCION>";
                xmlDireccion += "<ID_DIRECCION>" + beanClienteDireccion.getId_cliente_direccion() + "</ID_DIRECCION>";
                xmlDireccion += "<ID_ZONA>" + beanClienteDireccion.getBeanZona().getId_zona() + "</ID_ZONA>";
                xmlDireccion += "<ID_UBIGEO>" + beanClienteDireccion.getUbigeo().getCodigo() + "</ID_UBIGEO>";
                xmlDireccion += "<DIRECCION>" + beanClienteDireccion.getDireccion() + "</DIRECCION>";
                xmlDireccion += "<ESTADO>" + beanClienteDireccion.getEstado() + "</ESTADO>";
                xmlDireccion += "<OPERACION>" + beanClienteDireccion.getOperacion() + "</OPERACION>";
                xmlDireccion += "</DIRECCION>";
            }
        }
        xmlDireccion += "</DIRECCIONES>";
        System.out.println("xml_Direccion: " + xmlDireccion);
        return xmlDireccion;
    }

    private String getXmlSustituto() {
        String xmlSustituto = "<?xml version=\"1.0\" ?> ";
        xmlSustituto += "<SUSTITUTOS>";
        for (int i = 0; i < modeltableClienteSustituto.getRowCount(); i++) {
            ClienteSustituto beanClienteSustituto = modeltableClienteSustituto.getClienteSustituto(i);
            if (!beanClienteSustituto.getOperacion().equals("")) {
                xmlSustituto += "<SUSTITUTO>";
                xmlSustituto += "<ID_SUSTITUTO>" + beanClienteSustituto.getId_cliente_sustituto() + "</ID_SUSTITUTO>";
                xmlSustituto += "<ID_HIJO>" + beanClienteSustituto.getBeanCliente().getIdCliente() + "</ID_HIJO>";
                xmlSustituto += "<ESTADO>" + beanClienteSustituto.getEstado() + "</ESTADO>";
                xmlSustituto += "<OPERACION>" + beanClienteSustituto.getOperacion() + "</OPERACION>";
                xmlSustituto += "</SUSTITUTO>";
            }
        }
        xmlSustituto += "</SUSTITUTOS>";
        System.out.println("xml_SUSTITUTOS: " + xmlSustituto);
        return xmlSustituto;
    }

    private String getXmlPadron(SimpleDateFormat fe) {
        String xmlPadron = "<?xml version=\"1.0\" ?> ";
        xmlPadron += "<PADRONES>";
        for (int i = 0; i < modeltableClientePadron.getRowCount(); i++) {
            AnexoPadron beanClientePadron = modeltableClientePadron.getAnexoPadron(i);
            if (!beanClientePadron.getOperacion().equals("")) {
                xmlPadron += "<PADRON>";
                xmlPadron += "<ID_CLIENTE_PADRON>" + beanClientePadron.getIdPadronAnexo() + "</ID_CLIENTE_PADRON>";
                xmlPadron += "<ID_PADRON>" + beanClientePadron.getIdPadron() + "</ID_PADRON>";
                xmlPadron += "<F_INICIO>" + fe.format(beanClientePadron.getFecInicio()) + "</F_INICIO>";
                xmlPadron += "<F_FIN>" + ((beanClientePadron.getFecfin() == null) ? beanClientePadron.getFecfin() : fe.format(beanClientePadron.getFecfin())) + "</F_FIN>";
                xmlPadron += "<ESTADO>" + beanClientePadron.getEstado() + "</ESTADO>";
                xmlPadron += "<OPERACION>" + beanClientePadron.getOperacion() + "</OPERACION>";
                xmlPadron += "</PADRON>";
            }
        }
        xmlPadron += "</PADRONES>";
        System.out.println("xml_Padron: " + xmlPadron);
        return xmlPadron;
    }

    private String getXmlContacto() {
        //Llenar XmlContacto
        String xmlContacto = "<?xml version=\"1.0\" ?> ";
        xmlContacto += "<CONTACTOS>";
        for (int i = 0; i < modeltableClienteContacto.getRowCount(); i++) {
            ClienteContacto beanClienteContacto = modeltableClienteContacto.getClienteContacto(i);
            if (!beanClienteContacto.getOperacion().equals("")) {
                xmlContacto += "<CONTACTO>";
                xmlContacto += "<ID_CLIENTE_CONTACTO>" + beanClienteContacto.getId_cliente_contacto() + "</ID_CLIENTE_CONTACTO>";
                xmlContacto += "<PATERNO>" + beanClienteContacto.getPaterno() + "</PATERNO>";
                xmlContacto += "<MATERNO>" + beanClienteContacto.getMaterno() + "</MATERNO>";
                xmlContacto += "<NOMBRE>" + beanClienteContacto.getNombre() + "</NOMBRE>";
                xmlContacto += "<CORREO>" + beanClienteContacto.getCorreo() + "</CORREO>";
                xmlContacto += "<TELEF>" + beanClienteContacto.getTelefono() + "</TELEF>";
                xmlContacto += "<CELULAR>" + beanClienteContacto.getCelular() + "</CELULAR>";
                xmlContacto += "<ESTADO>" + beanClienteContacto.getEstado() + "</ESTADO>";
                xmlContacto += "<OPERACION>" + beanClienteContacto.getOperacion() + "</OPERACION>";
                xmlContacto += "</CONTACTO>";
            }
        }
        xmlContacto += "</CONTACTOS>";
        System.out.println("xml_Contacto: " + xmlContacto);
        return xmlContacto;
    }

    private String getXmlCuenta() {
        String xmlCuenta = "<?xml version=\"1.0\" ?> ";
        xmlCuenta += "<CUENTAS>";
        for (int i = 0; i < modeltableClienteCuenta.getRowCount(); i++) {
            ClienteCuenta beanClienteCuenta = modeltableClienteCuenta.getClienteCuenta(i);
            if (!beanClienteCuenta.getOperacion().equals("")) {
                xmlCuenta += "<CUENTA>";
                xmlCuenta += "<ID_CLIENTE_CUENTA>" + beanClienteCuenta.getId_cliente_cuenta() + "</ID_CLIENTE_CUENTA>";
                xmlCuenta += "<ID_CUENTA>" + beanClienteCuenta.getId_cuenta() + "</ID_CUENTA>";
                xmlCuenta += "<DESCRIPCION>" + beanClienteCuenta.getDescr_cuenta() + "</DESCRIPCION>";
                xmlCuenta += "<NUM_CUENTA>" + beanClienteCuenta.getNum_cuenta() + "</NUM_CUENTA>";
                xmlCuenta += "<ESTADO>" + beanClienteCuenta.getEstado() + "</ESTADO>";
                xmlCuenta += "<OPERACION>" + beanClienteCuenta.getOperacion() + "</OPERACION>";
                xmlCuenta += "</CUENTA>";
            }
        }
        xmlCuenta += "</CUENTAS>";
        System.out.println("xml_Cuenta: " + xmlCuenta);
        return xmlCuenta;
    }

    private String getXmlCredito(SimpleDateFormat fe) {
        String xmlCredito = "<?xml version=\"1.0\" ?> ";
        xmlCredito += "<CREDITOS>";
        for (int i = 0; i < modeltableClienteCredito.getRowCount(); i++) {
            ClienteCredito beanClienteCredito = modeltableClienteCredito.getClienteCredito(i);
            if (!beanClienteCredito.getOperacion().equals("")) {
                xmlCredito += "<CREDITO>";
                xmlCredito += "<ID_CLIENTE_CREDITO>" + beanClienteCredito.getId_cliente_credito() + "</ID_CLIENTE_CREDITO>";
                xmlCredito += "<MOTIVO>" + beanClienteCredito.getMotivo() + "</MOTIVO>";
                xmlCredito += "<MONTO>" + beanClienteCredito.getMonto() + "</MONTO>";
                xmlCredito += "<F_INICIO>" + fe.format(beanClienteCredito.getFecha_inicio()) + "</F_INICIO>";
                //xmlCredito += "<F_FIN>" + ((beanClientePadron.getFecfin() == null) ? beanClientePadron.getFecfin() : fe.format(beanClientePadron.getFecfin())) + "</F_FIN>";
                xmlCredito += "<F_FIN>" + ((beanClienteCredito.getFecha_fin() == null) ? "" : fe.format(beanClienteCredito.getFecha_fin())) + "</F_FIN>";
                xmlCredito += "<FLAG_TEMPORAL>" + beanClienteCredito.getFlagTemporal() + "</FLAG_TEMPORAL>";
                xmlCredito += "<ESTADO>" + beanClienteCredito.getEstado() + "</ESTADO>";
                xmlCredito += "<OPERACION>" + beanClienteCredito.getOperacion() + "</OPERACION>";
                xmlCredito += "</CREDITO>";
            }
        }
        for (int i = 0; i < modeltableClienteCreditoTemp.getRowCount(); i++) {
            ClienteCredito beanClienteCredito = modeltableClienteCreditoTemp.getClienteCredito(i);
            if (!beanClienteCredito.getOperacion().equals("")) {
                xmlCredito += "<CREDITO>";
                xmlCredito += "<ID_CLIENTE_CREDITO>" + beanClienteCredito.getId_cliente_credito() + "</ID_CLIENTE_CREDITO>";
                xmlCredito += "<MOTIVO>" + beanClienteCredito.getMotivo() + "</MOTIVO>";
                xmlCredito += "<MONTO>" + beanClienteCredito.getMonto() + "</MONTO>";
                xmlCredito += "<F_INICIO>" + fe.format(beanClienteCredito.getFecha_inicio()) + "</F_INICIO>";
                //xmlCredito += "<F_FIN>" + ((beanClientePadron.getFecfin() == null) ? beanClientePadron.getFecfin() : fe.format(beanClientePadron.getFecfin())) + "</F_FIN>";
                xmlCredito += "<F_FIN>" + ((beanClienteCredito.getFecha_fin() == null) ? "" : fe.format(beanClienteCredito.getFecha_fin())) + "</F_FIN>";
                xmlCredito += "<FLAG_TEMPORAL>" + beanClienteCredito.getFlagTemporal() + "</FLAG_TEMPORAL>";
                xmlCredito += "<ESTADO>" + beanClienteCredito.getEstado() + "</ESTADO>";
                xmlCredito += "<OPERACION>" + beanClienteCredito.getOperacion() + "</OPERACION>";
                xmlCredito += "</CREDITO>";
            }
        }
        xmlCredito += "</CREDITOS>";
        System.out.println("xml_Credito: " + xmlCredito);
        return xmlCredito;
    }

    private BeanCliente getBeanCliente() {
        BeanCliente beanCliente = new BeanCliente();
        SimpleDateFormat fe = new SimpleDateFormat("dd/MM/yyyy");
        beanCliente.setIdCliente(txtCodigo.getText().trim());
        char val = txtNumDoc.getText().charAt(0);
        String flag_tipo_persona = (xTipoDocIden.get(cboTipoDocIden.getSelectedIndex() - 1).getId_tipo_doc().equals("05") && val == '2') ? "J" : "N";
        beanCliente.setFlagTipoPersona(flag_tipo_persona);
        beanCliente.setPaterno(txtApePaterno.getText().trim());
        beanCliente.setMaterno(txtApeMaterno.getText().trim());
        beanCliente.setNombres(txtNombre.getText().trim());
        beanCliente.setDescripcion(txtDescripcion.getText().trim());
        BeanTipoDocIden beanTDV = new BeanTipoDocIden();
        beanTDV.setId_tipo_doc(cboTipoDocIden.getSelectedIndex() > 0 ? xTipoDocIden.get(cboTipoDocIden.getSelectedIndex() - 1).getId_tipo_doc() : "");
        beanCliente.setTipoDoc(beanTDV);
        beanCliente.setNumero(txtNumDoc.getText().trim());
        beanCliente.setDireccion(txtDireccion.getText().trim());
        beanCliente.setSexo(rbSexoMasculino.isSelected() ? "M" : "F");
        beanCliente.setTelefono(txtTelFijo.getText().trim());
        beanCliente.setCelular(txtTelMovil.getText().trim());
        beanCliente.setEmail(txtEmail.getText().trim());
        beanCliente.setIdNacionalidad(cboNacionalidad.getSelectedIndex() > 0 ? xNacionalidad.get(cboNacionalidad.getSelectedIndex() - 1).getCodigo() : "");
        beanCliente.setFlagPercepcion(chkAgpercepcion.isSelected() ? "S" : "N");
        beanCliente.setFlagRetencion(chkAgretencion.isSelected() ? "S" : "N");
        beanCliente.setFlagExceptuado(chkExeptuado.isSelected() ? "S" : "N");
        beanCliente.setIdVendedor("");
        ClasifCliente beanClasifCliente = new ClasifCliente();
        beanClasifCliente.setId_clasif_cliente(cboClasifCliente.getSelectedIndex() > 0 ? xClasifCliente.get(cboClasifCliente.getSelectedIndex() - 1).getId_clasif_cliente() : 0);
        beanCliente.setClasifCliente(beanClasifCliente);
        beanCliente.setEstado(chkEstado.isSelected() ? "A" : "D");
        beanCliente.setLineaCred(new BigDecimal(txtCredito.getText().trim()));
        beanCliente.setLineaCredTemp(new BigDecimal(txtCreditoTemp.getText().trim()));
        beanCliente.setIdUsuario(usuario.getId_usuario());

        beanCliente.setXmlActivacion(this.getXmlActivacion(fe));
        beanCliente.setXmlDireccion(this.getXmlDireccion());
        beanCliente.setXmlSustituto(this.getXmlSustituto());
        beanCliente.setXmlPadron(this.getXmlPadron(fe));
        beanCliente.setXmlContacto(this.getXmlContacto());
        beanCliente.setXmlCuenta(this.getXmlCuenta());
        beanCliente.setXmlCredito(this.getXmlCredito(fe));

        return beanCliente;
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
            //modeltableAnexoActivacion.agregarVectorCliente(regla.listarCliente(""));
            modeltableAnexoActivacion.setAnexoActivacion(anexoActivacion);
            //modeloOrdenadoAnexoActivacion.setRowFilter(getFilter());
            tableAnexoActivacion.setAllColumnPreferredWidth();
            tableAnexoActivacion.getColumnModel().getColumn(0).setCellRenderer(new CellRendererImageEstado());
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
        }
    }

    private void quitarDireccion() {
        if (tableClienteDireccion.getRowCount() == 0) {
            return;
        }
        if (tableClienteDireccion.getSelectedRow() >= 0) {
            if (modeltableClienteDireccion.getClienteDireccion(tableClienteDireccion.convertRowIndexToModel(tableClienteDireccion.getSelectedRow())).getEstado().equals("D")) {
                JOptionPane.showMessageDialog(this, "Direccion ya Esta desactivada", "Cliente Direccion", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            int xres = JOptionPane.showConfirmDialog(this, "Desea Quitar Direccion?", "Cliente", JOptionPane.OK_CANCEL_OPTION);
            if (xres == JOptionPane.OK_OPTION) {
                if (modeltableClienteDireccion.getClienteDireccion(tableClienteDireccion.convertRowIndexToModel(tableClienteDireccion.getSelectedRow())).getOperacion().equals("I")) {
                    modeltableClienteDireccion.deleteClienteDireccion(tableClienteDireccion.convertRowIndexToModel(tableClienteDireccion.getSelectedRow()));
                } else {
                    modeltableClienteDireccion.getClienteDireccion(tableClienteDireccion.convertRowIndexToModel(tableClienteDireccion.getSelectedRow())).setEstado("D");
                    modeltableClienteDireccion.getClienteDireccion(tableClienteDireccion.convertRowIndexToModel(tableClienteDireccion.getSelectedRow())).setOperacion("A");
                }
            }
        } else {
            JOptionPane.showMessageDialog(this, "Para quitar una direccion primero debe seleccionar la fila.", "Quitar Direccion", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    private void quitarContacto() {
        if (tableClienteContacto.getRowCount() == 0) {
            return;
        }
        if (tableClienteContacto.getSelectedRow() >= 0) {
            if (modeltableClienteContacto.getClienteContacto(tableClienteContacto.convertRowIndexToModel(tableClienteContacto.getSelectedRow())).getEstado().equals("D")) {
                JOptionPane.showMessageDialog(this, "Contacto ya esta Desactivado", "Cliente Contacto", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            int xres = JOptionPane.showConfirmDialog(this, "Desea Quitar Contacto?", "Cliente Contacto", JOptionPane.OK_CANCEL_OPTION);
            if (xres == JOptionPane.OK_OPTION) {
                if (modeltableClienteContacto.getClienteContacto(tableClienteContacto.convertRowIndexToModel(tableClienteContacto.getSelectedRow())).getOperacion().equals("I")) {
                    modeltableClienteContacto.deleteClienteContacto(tableClienteContacto.convertRowIndexToModel(tableClienteContacto.getSelectedRow()));
                } else {
                    modeltableClienteContacto.getClienteContacto(tableClienteContacto.convertRowIndexToModel(tableClienteContacto.getSelectedRow())).setEstado("D");
                    modeltableClienteContacto.getClienteContacto(tableClienteContacto.convertRowIndexToModel(tableClienteContacto.getSelectedRow())).setOperacion("A");
                }
            }
        } else {
            JOptionPane.showMessageDialog(this, "Seleccione Fila.", "Quitar Contacto", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    private void quitarCuenta() {
        if (tableClienteCuenta.getRowCount() == 0) {
            return;
        }
        if (tableClienteCuenta.getSelectedRow() >= 0) {
            if (modeltableClienteCuenta.getClienteCuenta(tableClienteCuenta.convertRowIndexToModel(tableClienteCuenta.getSelectedRow())).getEstado().equals("D")) {
                JOptionPane.showMessageDialog(this, "Cuenta ya esta Desactivada", "Cliente Cuenta", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            int xres = JOptionPane.showConfirmDialog(this, "Desea Quitar Cuenta?", "Cliente Cuenta", JOptionPane.OK_CANCEL_OPTION);
            if (xres == JOptionPane.OK_OPTION) {
                if (modeltableClienteCuenta.getClienteCuenta(tableClienteCuenta.convertRowIndexToModel(tableClienteCuenta.getSelectedRow())).getOperacion().equals("I")) {
                    modeltableClienteCuenta.deleteClienteCuenta(tableClienteCuenta.convertRowIndexToModel(tableClienteCuenta.getSelectedRow()));
                } else {
                    modeltableClienteCuenta.getClienteCuenta(tableClienteCuenta.convertRowIndexToModel(tableClienteCuenta.getSelectedRow())).setEstado("D");
                    modeltableClienteCuenta.getClienteCuenta(tableClienteCuenta.convertRowIndexToModel(tableClienteCuenta.getSelectedRow())).setOperacion("A");
                }
            }
        } else {
            JOptionPane.showMessageDialog(this, "Seleccione Fila.", "Quitar Cuenta", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    private void activarSustituto() {
        if (tableClienteSustituto.getRowCount() == 0) {
            return;
        }
        if (tableClienteSustituto.getSelectedRow() >= 0) {
            if (modeltableClienteSustituto.getClienteSustituto(tableClienteSustituto.convertRowIndexToModel(tableClienteSustituto.getSelectedRow())).getEstado().equals("A")) {
                JOptionPane.showMessageDialog(this, "Sustituto ya esta activado", "Cliente Sustituto", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            if (modeltableClienteSustituto.getClienteSustituto(tableClienteSustituto.convertRowIndexToModel(tableClienteSustituto.getSelectedRow())).getBeanCliente().getEstado().equals("D")) {
                JOptionPane.showMessageDialog(this, "Cliente esta desactivado", "Cliente Sustituto", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            int xres = JOptionPane.showConfirmDialog(this, "Desea activar Cliente Sustituto?", "Cliente", JOptionPane.OK_CANCEL_OPTION);
            if (xres == JOptionPane.OK_OPTION) {
                modeltableClienteSustituto.getClienteSustituto(tableClienteSustituto.convertRowIndexToModel(tableClienteSustituto.getSelectedRow())).setEstado("A");
                modeltableClienteSustituto.getClienteSustituto(tableClienteSustituto.convertRowIndexToModel(tableClienteSustituto.getSelectedRow())).setOperacion("A");
            }
        } else {
            JOptionPane.showMessageDialog(this, "Seleccionar un Elemento.", "Quitar Sustituto", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    private void desactivarSustituto() {
        if (tableClienteSustituto.getRowCount() == 0) {
            return;
        }
        if (tableClienteSustituto.getSelectedRow() >= 0) {
            if (modeltableClienteSustituto.getClienteSustituto(tableClienteSustituto.convertRowIndexToModel(tableClienteSustituto.getSelectedRow())).getEstado().equals("D")) {
                JOptionPane.showMessageDialog(this, "Sustituto ya esta desactivado", "Cliente Sustituto", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            int xres = JOptionPane.showConfirmDialog(this, "Desea Desactivar Cliente Sustituto?", "Cliente", JOptionPane.OK_CANCEL_OPTION);
            if (xres == JOptionPane.OK_OPTION) {
                if (modeltableClienteSustituto.getClienteSustituto(tableClienteSustituto.convertRowIndexToModel(tableClienteSustituto.getSelectedRow())).getOperacion().equals("I")) {
                    modeltableClienteSustituto.deleteClienteSustituto(tableClienteSustituto.convertRowIndexToModel(tableClienteSustituto.getSelectedRow()));
                    modeltableClienteSustituto.fireTableDataChanged();
                } else {
                    modeltableClienteSustituto.getClienteSustituto(tableClienteSustituto.convertRowIndexToModel(tableClienteSustituto.getSelectedRow())).setEstado("D");
                    modeltableClienteSustituto.getClienteSustituto(tableClienteSustituto.convertRowIndexToModel(tableClienteSustituto.getSelectedRow())).setOperacion("A");
                }
            }
        } else {
            JOptionPane.showMessageDialog(this, "Seleccionar un Elemento.", "Quitar Sustituto", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    private void desactivarPadron() {
        if (tableClientePadron.getRowCount() == 0) {
            return;
        }
        if (tableClientePadron.getSelectedRow() >= 0) {
            if (modeltableClientePadron.getAnexoPadron(tableClientePadron.convertRowIndexToModel(tableClientePadron.getSelectedRow())).getEstado().equals("D")) {
                JOptionPane.showMessageDialog(this, "Padron Seleccionado ya esta desactivado", "Padrones", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            int xres = JOptionPane.showConfirmDialog(this, "Desea Desactivar Padron?", "Padrones", JOptionPane.OK_CANCEL_OPTION);
            if (xres == JOptionPane.OK_OPTION) {
                modeltableClientePadron.getAnexoPadron(tableClientePadron.convertRowIndexToModel(tableClientePadron.getSelectedRow())).setFecfin(Main.fechaActualServer);
                modeltableClientePadron.getAnexoPadron(tableClientePadron.convertRowIndexToModel(tableClientePadron.getSelectedRow())).setEstado("D");
                if (modeltableClientePadron.getAnexoPadron(tableClientePadron.convertRowIndexToModel(tableClientePadron.getSelectedRow())).getIdPadron().equals("01")) {
                    chkExeptuado.setSelected(false);
                } else if (modeltableClientePadron.getAnexoPadron(tableClientePadron.convertRowIndexToModel(tableClientePadron.getSelectedRow())).getIdPadron().equals("02")) {
                    chkAgretencion.setSelected(false);
                } else if (modeltableClientePadron.getAnexoPadron(tableClientePadron.convertRowIndexToModel(tableClientePadron.getSelectedRow())).getIdPadron().equals("03")) {
                    chkAgpercepcion.setSelected(false);
                }
                if (modeltableClientePadron.getAnexoPadron(tableClientePadron.convertRowIndexToModel(tableClientePadron.getSelectedRow())).getOperacion().equals("")) {
                    modeltableClientePadron.getAnexoPadron(tableClientePadron.convertRowIndexToModel(tableClientePadron.getSelectedRow())).setOperacion("A");
                }
            }
        } else {
            JOptionPane.showMessageDialog(this, "Seleccionar Fila", "Padrones", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    private void changeTipoDocIdentidad() {
        if (cboTipoDocIden.getSelectedIndex() == 0) {
            txtNumDoc.setEnabled(false);
            txtApePaterno.setEnabled(false);
            txtApeMaterno.setEnabled(false);
            txtNombre.setEnabled(false);
            txtDescripcion.setEnabled(false);
        } else {
            boolean isDescripcion = !String.valueOf(cboTipoDocIden.getSelectedItem()).equalsIgnoreCase("DNI");
            txtApePaterno.setEnabled(!isDescripcion);
            txtApeMaterno.setEnabled(!isDescripcion);
            txtNombre.setEnabled(!isDescripcion);
            txtDescripcion.setEnabled(isDescripcion);
            txtNumDoc.setEnabled(true);
            txtNumDoc.setDocument(new IntegerDocument(isDescripcion ? 11 : 8));
            rbSexoMasculino.setEnabled(!isDescripcion);
            rbSexoFemenino.setEnabled(!isDescripcion);
            lblDescripcion.setVisible(isDescripcion);
            txtDescripcion.setVisible(isDescripcion);
            lblSexo.setVisible(!isDescripcion);
            panelSexo.setVisible(isDescripcion);
            txtNumDoc.requestFocus();
        }
        txtApeMaterno.setText(null);
        txtApePaterno.setText(null);
        txtNombre.setText(null);
        txtDescripcion.setText(null);
        txtNumDoc.setText(null);
    }

    private void activarCliente() {
        //Verificar si Existe Activado
        if (modeltableAnexoActivacion.getAnexoActivacion(modeltableAnexoActivacion.getRowCount() - 1).getEstado().equals("A")) {
            JOptionPane.showMessageDialog(this, "Cliente ya Esta Activado");
            return;
        }
        if (!modeltableAnexoActivacion.getAnexoActivacion(modeltableAnexoActivacion.getRowCount() - 1).getOperacion().equals("")) {
            JOptionPane.showMessageDialog(this, "Cliente recien lo acaba de Desactivar");
            return;
        }
        FormAnexoActivacion frmAnexoActivacion = new FormAnexoActivacion(this, path, "A", "Cliente");//,btnActivarCliente
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

    private void desactivarCliente() {
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
                JOptionPane.showMessageDialog(this, "Cliente recien lo acaba de Activar");
                return;
            }
            FormAnexoActivacion frmAnexoActivacion = new FormAnexoActivacion(this, path, "D", "Cliente");
            if (frmAnexoActivacion.swRegistro) {
                modeltableAnexoActivacion.getAnexoActivacion(row).setEstado("D");
                modeltableAnexoActivacion.getAnexoActivacion(row).setOperacion("A");
                modeltableAnexoActivacion.getAnexoActivacion(row).setMotivoDesactivacion(frmAnexoActivacion.getTxtMotivo().getText().trim());
                java.util.Date fechafin = frmAnexoActivacion.getDc_fechainicio().getDate();
                java.sql.Date fin = new java.sql.Date(fechafin.getTime());
                modeltableAnexoActivacion.getAnexoActivacion(row).setFechaFin(fin);
                chkEstado.setSelected(false);
            }
        } else {
            JOptionPane.showMessageDialog(this, "Seleccione un Registro");
        }
    }

    @Override
    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        if (cboTipoDocIden.getSelectedIndex() < 1) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Cliente, debes Seleccionar un Tipo de Documento.", "Datos incompletos de Cliente", JOptionPane.CANCEL_OPTION);
            cboTipoDocIden.setBorder(new LineBorder(Color.RED));
            cboTipoDocIden.requestFocus();
            return false;
        }
        if (cboTipoDocIden.getSelectedItem().equals("DNI")) {
            if (this.txtNumDoc.getText().length() < 8) {
                JOptionPane.showMessageDialog(this, "El número de DNI que has especificado no es válida. Compruébala e inténtalo de nuevo.", "Datos incompletos del Proveedor", 2);
                txtNumDoc.setBorder(new LineBorder(Color.RED));
                txtNumDoc.requestFocus();
                txtNumDoc.selectAll();
                return false;
            }
            txtApePaterno.setBorder(txt.getBorder());
            if (txtApePaterno.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Cliente, debes " + "especificar su Apellido Paterno.", "Datos incompletos del Cliente", JOptionPane.CANCEL_OPTION);
                txtApePaterno.setBorder(new LineBorder(Color.RED));
                txtApePaterno.requestFocus();
                return false;
            }
            txtApeMaterno.setBorder(txt.getBorder());
            if (txtApeMaterno.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Cliente, debes " + "especificar su Apellido Materno.", "Datos incompletos del Cliente", JOptionPane.CANCEL_OPTION);
                txtApeMaterno.setBorder(new LineBorder(Color.RED));
                txtApeMaterno.requestFocus();
                return false;
            }
            txtNombre.setBorder(txt.getBorder());
            if (txtNombre.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Cliente, debes " + "especificar su Nombre.", "Datos incompletos del Cliente", JOptionPane.CANCEL_OPTION);
                txtNombre.setBorder(new LineBorder(Color.RED));
                txtNombre.requestFocus();
                return false;
            }
        }
        if (cboTipoDocIden.getSelectedItem().equals("RUC")) {
            if (this.txtNumDoc.getText().length() < 11) {
                JOptionPane.showMessageDialog(this, "El número de RUC que has especificado no es válida. Compruébala e inténtalo de nuevo.", "Datos incompletos del Proveedor", 2);
                txtNumDoc.setBorder(new LineBorder(Color.RED));
                txtNumDoc.requestFocus();
                txtNumDoc.selectAll();

                return false;
            }
            char val = txtNumDoc.getText().charAt(0);
            if (val == '1') {
                txtApePaterno.setBorder(txt.getBorder());
                if (txtApePaterno.getText().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, "Para " + namemode + " un Cliente, debes " + "especificar su Apellido Paterno.", "Datos incompletos del Cliente", JOptionPane.CANCEL_OPTION);
                    txtApePaterno.setBorder(new LineBorder(Color.RED));
                    txtApePaterno.requestFocus();
                    return false;
                }
                txtApeMaterno.setBorder(txt.getBorder());
                if (txtApeMaterno.getText().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, "Para " + namemode + " un Cliente, debes " + "especificar su Apellido Materno.", "Datos incompletos del Cliente", JOptionPane.CANCEL_OPTION);
                    txtApeMaterno.setBorder(new LineBorder(Color.RED));
                    txtApeMaterno.requestFocus();
                    return false;
                }
                txtNombre.setBorder(txt.getBorder());
                if (txtNombre.getText().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, "Para " + namemode + " un Cliente, debes " + "especificar su Nombre.", "Datos incompletos del Cliente", JOptionPane.CANCEL_OPTION);
                    txtNombre.setBorder(new LineBorder(Color.RED));
                    txtNombre.requestFocus();
                    return false;
                }
            }

        }
        txtDescripcion.setBorder(txt.getBorder());
        if (txtDescripcion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Cliente, debes " + "especificar su Descripcion.", "Datos incompletos del Cliente", JOptionPane.CANCEL_OPTION);
            txtDescripcion.setBorder(new LineBorder(Color.RED));
            txtDescripcion.requestFocus();
            return false;
        }
        if (!cboTipoDocIden.getSelectedItem().equals("OTROS")) {
            if (cboClasifCliente.getSelectedIndex() < 1) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Cliente, debes Seleccionar un Tipo de Cliente.", "Datos incompletos de Cliente", JOptionPane.CANCEL_OPTION);
                cboClasifCliente.setBorder(new LineBorder(Color.RED));
                cboClasifCliente.requestFocus();
                return false;
            }
        }

        if (cboNacionalidad.getSelectedIndex() < 1) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Cliente, debes Seleccionar una Nacionalidad.", "Datos incompletos de Cliente", JOptionPane.CANCEL_OPTION);
            cboNacionalidad.setBorder(new LineBorder(Color.RED));
            cboNacionalidad.requestFocus();
            return false;
        }
        if (Constans.IS_CLIENTE_CONDICION_PAGO && txtNumDias.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Ingrese numero de Dias");
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
        cboTipoDocIden.setEnabled(flag);
        txtNumDoc.setEditable(flag);
        txtApePaterno.setEditable(flag);
        txtApeMaterno.setEditable(flag);
        txtNombre.setEditable(flag);
        txtDescripcion.setEditable(flag);
        txtDireccion.setEditable(flag);
        txtTelFijo.setEditable(flag);
        txtTelMovil.setEditable(flag);
        cboClasifCliente.setEnabled(flag);
        cboNacionalidad.setEnabled(flag);
        txtEmail.setEditable(flag);
    }

    @Override
    public void loadCombo() {
        try {
            loadTipoDocIden();
            loadNacionalidad();
            loadClasifCliente();
            tableClienteDireccion.getColumnModel().getColumn(0).setCellRenderer(new CellRendererImageEstado());
            tableClientePadron.getColumnModel().getColumn(0).setCellRenderer(new CellRendererImageEstado());
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void newRegister() {
        JTextField txt = new JTextField();
        txtCodigo.setText("");
        txtNumDoc.setEnabled(false);
        txtApePaterno.setEnabled(false);
        txtApeMaterno.setEnabled(false);
        txtNombre.setEnabled(false);
        txtDescripcion.setEnabled(false);
        rbSexoMasculino.setSelected(true);
        cboNacionalidad.setSelectedItem("PERUANA");
        cboTipoDocIden.setBorder(txt.getBorder());
        chkEstado.setSelected(true);
        txtCredito.setText("0");
        txtCreditoTemp.setText("0");
        activacionDefecto();
        btnActivarCliente.setEnabled(false);
        btnDesactivarCliente.setEnabled(false);
    }

    @Override
    public boolean loadRegister() {
        try {
            String idCliente = rowSelection.getSelectedValue(1).toString();
            txtCodigo.setText(idCliente);
            RnCliente regla = new RnCliente(path);
            BeanCliente beanCliente = regla.beanCliente(idCliente);
            cboTipoDocIden.setSelectedItem(beanCliente.getTipoDoc().getAbreviatura());
            txtNumDoc.setText(beanCliente.getNumero());
            validateRuc();
            txtApePaterno.setText(beanCliente.getPaterno());
            txtApeMaterno.setText(beanCliente.getMaterno());
            txtNombre.setText(beanCliente.getNombres());
            txtDescripcion.setText(beanCliente.getDescripcion());
            txtDireccion.setText(beanCliente.getDireccion());
            rbSexoMasculino.setSelected(beanCliente.getSexo().equals("M"));
            rbSexoFemenino.setSelected(beanCliente.getSexo().equals("F"));
            txtTelFijo.setText(beanCliente.getTelefono());
            txtTelMovil.setText(beanCliente.getCelular());
            txtEmail.setText(beanCliente.getEmail());
            cboNacionalidad.setSelectedItem(beanCliente.getDescNacionalidad());
            cboClasifCliente.setSelectedItem(beanCliente.getClasifCliente().getDescripcion());
            chkEstado.setSelected(beanCliente.getEstado().equals("A"));
            chkAgpercepcion.setSelected(beanCliente.getFlagPercepcion().equals("S"));
            chkAgretencion.setSelected(beanCliente.getFlagRetencion().equals("S"));
            chkExeptuado.setSelected(beanCliente.getFlagExceptuado().equals("S"));
            txtCredito.setText(beanCliente.getLineaCred().toString());
            txtCreditoTemp.setText(beanCliente.getLineaCredTemp().toString());
            //Anexo Activacion
            modeltableAnexoActivacion.agregarVectorAnexoActivacion(beanCliente.getListaActivacion());
            modeltableAnexoActivacion.fireTableDataChanged();
            tableAnexoActivacion.getColumnModel().getColumn(0).setCellRenderer(new CellRendererImageEstado());
            //CLIENTE DIRECCION
            modeltableClienteDireccion.agregarVectorClienteDireccion(beanCliente.getListaclienteDireccion());
            //CLIENTE SUSTITUTO
            modeltableClienteSustituto.agregarVectorClienteSustituto(beanCliente.getListaclienteSustituto());
            modeloOrdenadoClienteSustituto.setRowFilter(getFilter());
            tableClienteSustituto.setAllColumnPreferredWidth();
            //CLIENTE PADRONES
            modeltableClientePadron.agregarListAnexoPadron(beanCliente.getListaclientePadron());
            tableClientePadron.setAllColumnPreferredWidth();
            //CLIENTE CONTACTO
            modeltableClienteContacto.agregarVectorClienteContacto(beanCliente.getListaclienteContacto());
            //CLIENTE CONTACTO
            modeltableClienteCuenta.agregarVectorClienteCuenta(beanCliente.getListaclienteCuenta());
            //CLIENTES CREDITOS
            for (ClienteCredito beanClienteCredito : beanCliente.getListaclienteCredito()) {
                if (beanClienteCredito.getFlagTemporal().equals("N")) {
                    modeltableClienteCredito.setClienteCredito(beanClienteCredito);
                } else {
                    modeltableClienteCreditoTemp.setClienteCredito(beanClienteCredito);
                }
            }
            if (Constans.IS_CLIENTE_CONDICION_PAGO) {
                this.loadCondicionPago(regla, idCliente);
            }
            return true;
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
            return false;
        }
    }

    private void loadCondicionPago(RnCliente regla, String idCliente) throws Exception {
        try {
            Anexo anexo = regla.getClienteCondicionPago(idCliente);
            String idCondicion = "";
            if (anexo.getCredito().equals("S")) {
                idCondicion = CondicionPagoEnum.CREDITO.getValue();
            } else if (anexo.getContado().equals("S")) {
                idCondicion = CondicionPagoEnum.CONTADO.getValue();
            }
            cboCondicionPago.setSelectedIndex(this.getPosCondicionPago(idCondicion));
            txtNumDias.setText(String.valueOf(anexo.getNumero()));
        } catch (Exception e) {
            throw e;
        }
    }

    private int getPosCondicionPago(String idCondicion) {
        for (int i = 0; i < cboCondicionPago.getItemCount(); i++) {
            ObjectItem obj = (ObjectItem) cboCondicionPago.getItemAt(i);
            if (idCondicion.equals(this.getIdObjectItem(obj))) {
                return i;
            }
        }
        return -1;
    }

    private String getIdObjectItem(ObjectItem obj) {
        if (obj == null || obj.getObjItem() == null) {
            return "";
        }
        return obj.getObjItem().toString();
    }

    @Override
    public boolean loadRegister(Object o) {
        return false;
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
        if (comp == btnAgregarDireccion) {
            modeltableClienteDireccion.setClienteDireccion((ClienteDireccion) valor);
            modeltableClienteDireccion.fireTableDataChanged();
        }
        if (comp == btnActivarPadron) {
            modeloOrdenadoClientePadron.setRowFilter(null);
            modeltableClientePadron.setAnexoPadron((AnexoPadron) valor);
            modeltableClientePadron.fireTableDataChanged();
            if (((AnexoPadron) valor).getIdPadron().equals("01")) {
                chkExeptuado.setSelected(((AnexoPadron) valor).getEstado().equals("A"));
            } else if (((AnexoPadron) valor).getIdPadron().equals("02")) {
                chkAgretencion.setSelected(((AnexoPadron) valor).getEstado().equals("A"));
            } else {
                chkAgpercepcion.setSelected(((AnexoPadron) valor).getEstado().equals("A"));
            }
        }
        if (comp == btnAgregarContacto) {
            modeloOrdenadoClienteContacto.setRowFilter(null);
            modeltableClienteContacto.setClienteContacto((ClienteContacto) valor);
            modeltableClienteContacto.fireTableDataChanged();
        }
        if (comp == btnAgregarCuenta) {
            modeloOrdenadoClienteCuenta.setRowFilter(null);
            modeltableClienteCuenta.setClienteCuenta((ClienteCuenta) valor);
            modeltableClienteCuenta.fireTableDataChanged();
        }
        if (comp == btnAgregarSustituto) {
            //modeloOrdenadoClienteSustituto.setRowFilter(null);
            modeloOrdenadoClienteSustituto.setRowFilter(getFilter());
            modeltableClienteSustituto.setClienteSustituto((ClienteSustituto) valor);
            modeltableClienteSustituto.fireTableDataChanged();
        }
        if (comp == btnActivarCredito) {
            modeloOrdenadoClienteCredito.setRowFilter(null);
            modeltableClienteCredito.setClienteCredito((ClienteCredito) valor);
            modeltableClienteCredito.fireTableDataChanged();
            txtCredito.setText(((ClienteCredito) valor).getMonto().add(new BigDecimal(txtCredito.getText().trim())).toString());
        }
        if (comp == btnActivarCreditoTemp) {
            modeloOrdenadoClienteCreditoTemp.setRowFilter(null);
            modeltableClienteCreditoTemp.setClienteCredito((ClienteCredito) valor);
            modeltableClienteCreditoTemp.fireTableDataChanged();
            txtCreditoTemp.setText(((ClienteCredito) valor).getMonto().add(new BigDecimal(txtCreditoTemp.getText().trim())).toString());
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

    private void saveCondicionPagoCliente(String idCliente, RnCliente rnCliente) throws Exception {
        try {
            if (!Constans.IS_CLIENTE_CONDICION_PAGO) {
                return;
            }
            String flagContado = "N";
            String flagCredito = "N";
            Integer numDias = Integer.parseInt(txtNumDias.getText().trim());
            String idCondicion = LoadComboItem.getIdCombo(cboCondicionPago);
            if (idCondicion.equals(CondicionPagoEnum.CONTADO.getValue())) {
                flagContado = "S";
            } else if (idCondicion.equals(CondicionPagoEnum.CREDITO.getValue())) {
                flagCredito = "S";
            }
            rnCliente.saveCondicionPagoCliente(idCliente, flagContado, flagCredito, numDias);
        } catch (Exception e) {
            throw e;
        }
    }

    @Override
    public String executeInsert() {
        try {
            RnCliente rnCliente = new RnCliente(path);
            String idCliente = rnCliente.mantCliente(this.getBeanCliente(), OperacionBDEnum.INSERTAR.getValue());
            this.saveCondicionPagoCliente(idCliente, rnCliente);
            return idCliente;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Cliente", JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public String executeUpdate() {
        try {
            RnCliente rnCliente = new RnCliente(path);
            String idCliente = rnCliente.mantCliente(this.getBeanCliente(), OperacionBDEnum.ACTUALIZAR.getValue());
            this.saveCondicionPagoCliente(idCliente, rnCliente);
            return idCliente;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Cliente", JOptionPane.OK_OPTION);
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
        if (e.getSource().equals(btnActivarCliente)) {
            this.activarCliente();
        }
        if (e.getSource().equals(btnDesactivarCliente)) {
            this.desactivarCliente();
        }
        if (btnAgregarDireccion == e.getSource()) {
            FormClienteDireccion frmClienteDireccion = new FormClienteDireccion(this, path, btnAgregarDireccion);
            frmClienteDireccion = null;
        }
        if (btnQuitarDireccion == e.getSource()) {
            quitarDireccion();
        }
        if (btnActivarPadron == e.getSource()) {
            FormAnexoPadron frmClientePadron = new FormAnexoPadron(this, path, btnActivarPadron, 2, modeltableClientePadron);
            frmClientePadron = null;
        }
        if (btnDesactivarPadron == e.getSource()) {
            desactivarPadron();
        }
        if (btnAgregarContacto == e.getSource()) {
            FormClienteContacto frmClienteContacto = new FormClienteContacto(this, btnAgregarContacto);
            frmClienteContacto = null;
        }
        if (btnQuitarContacto == e.getSource()) {
            quitarContacto();
        }
        if (btnAgregarCuenta == e.getSource()) {
            FormClienteCuenta frmClienteCuenta = new FormClienteCuenta(this, this.path, btnAgregarCuenta);
            frmClienteCuenta = null;
        }
        if (btnQuitarCuenta == e.getSource()) {
            quitarCuenta();
        }
        if (btnAgregarSustituto == e.getSource()) {
            FormClienteBuscar frmClienteBuscar = new FormClienteBuscar(this, this.path, btnAgregarSustituto);
            frmClienteBuscar.cargarDatos();
            frmClienteBuscar.setVisible(true);
        }
        if (btnDesactivarSustituto == e.getSource()) {
            desactivarSustituto();
        }
        if (btnActivarSustituto == e.getSource()) {
            activarSustituto();
        }

        if (btnActivarCredito == e.getSource()) {
            FormClienteCredito frmClienteCredito = new FormClienteCredito(this, btnActivarCredito, false);
            frmClienteCredito = null;
        }
        if (btnActivarCreditoTemp == e.getSource()) {
            FormClienteCredito frmClienteCredito = new FormClienteCredito(this, btnActivarCreditoTemp, true);
            frmClienteCredito = null;
        }
    }

    private void changeCondicionPago() {
        String idCondicionPago = LoadComboItem.getIdCombo(cboCondicionPago);
        txtNumDias.setEnabled(idCondicionPago.equals(CondicionPagoEnum.CREDITO.getValue()));
        txtNumDias.setText("0");
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        if (e.getSource().equals(cboCondicionPago)) {
            this.changeCondicionPago();
        }
        if (e.getSource().equals(cboTipoDocIden)) {
            this.changeTipoDocIdentidad();
        }
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

    private void validateRuc() {
        if (String.valueOf(cboTipoDocIden.getSelectedItem()).equalsIgnoreCase("RUC")) {
            if (txtNumDoc.getText().length() == 1 || txtNumDoc.getText().length() == 11) {
                char val = txtNumDoc.getText().charAt(0);
                boolean isPersonaNatural;
                if (val == '1') {
                    isPersonaNatural = true;
                } else if (val == '2') {
                    isPersonaNatural = false;
                    txtNumDoc.requestFocus();
                } else {
                    isPersonaNatural = false;
                    JOptionPane.showMessageDialog(null, "EL DOCUMENTO RUC EMPIEZA CON 1 Ó 2");
                    txtNumDoc.setText(null);
                }
                txtApePaterno.setEnabled(isPersonaNatural);
                txtApeMaterno.setEnabled(isPersonaNatural);
                txtNombre.setEnabled(isPersonaNatural);
                txtDescripcion.setEnabled(!isPersonaNatural);
                rbSexoMasculino.setEnabled(isPersonaNatural);
                rbSexoFemenino.setEnabled(isPersonaNatural);
                lblDescripcion.setVisible(!isPersonaNatural);
                txtDescripcion.setVisible(!isPersonaNatural);
                lblSexo.setVisible(isPersonaNatural);
                panelSexo.setVisible(isPersonaNatural);
            }
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getSource() == txtNumDoc) {
            validateRuc();
        }

        if (e.getSource() == txtApeMaterno || e.getSource() == txtApePaterno || e.getSource() == txtNombre) {
            String descripcionT = txtApePaterno.getText().trim() + " " + txtApeMaterno.getText().trim() + " " + txtNombre.getText().trim();
            txtDescripcion.setText(descripcionT);
        }

        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txtNumero)) {
                filtrar();
            }
            if ((e.getSource() == txtRazonSocial)) {
                filtrar();
            }
        }

        if (e.getKeyCode() == KeyEvent.VK_CONTROL) {
            onClickOk();
        }

    }

    @Override
    public void focusGained(FocusEvent e) {
    }

    @Override
    public void focusLost(FocusEvent e) {
    }
}
