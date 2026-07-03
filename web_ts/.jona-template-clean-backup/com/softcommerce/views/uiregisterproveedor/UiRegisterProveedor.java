package com.softcommerce.views.uiregisterproveedor;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.BeanTipoDocIden;
import com.softcommerce.beans.BeanEstadoCivil;
import com.softcommerce.beans.Nacionalidad;
import com.softcommerce.beans.ProveedorDireccion;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.CRadioButton;
import com.softcommerce.general.controles.CScrollPane;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.CTextArea;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHDialog;
import static com.softcommerce.general.controles.Register.INSERT;
import com.softcommerce.general.controles.UpperCaseDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.ProveedorDireccionTableModel;
import com.softcommerce.gui.FormPanelConfigPadronProveedor;
import com.softcommerce.iconos.Gif;
import com.softcommerce.inputvalidator.ValidDocumento;
import com.softcommerce.logic.LogicDireccionProveedor;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.reglasnegocio.RnEstadoCivil;
import com.softcommerce.reglasnegocio.RnNacionalidad;
import com.softcommerce.reglasnegocio.RnTipoDocIden;
import com.softcommerce.util.render.CellRendererImageEstado;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.PeticionPost;
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
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTextField;
import javax.swing.JToolBar;
import javax.swing.SwingConstants;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;
import javax.swing.table.TableRowSorter;
import org.apache.log4j.Logger;

public class UiRegisterProveedor
        extends JHDialog
        implements InterUiRegisterProveedor, ActionListener, ItemListener, KeyListener, WindowListener, MouseListener, FocusListener, TableModelListener, ListSelectionListener {

    protected ButtonGroup bg_TipoPersona;
    protected CRadioButton rb_TipoPersonaNatural;
    protected CRadioButton rb_TipoPersonaJuridica;
    protected CRadioButton rb_TipoPersonaNinguno;
    protected ButtonGroup bg_Sexo;
    protected CRadioButton rb_SexoMasculino;
    protected CRadioButton rb_SexoFemenino;
    protected CRadioButton rb_SexoNinguno;
    protected JTextField txt_Codigo;
    protected JTextField txt_ApePaterno;
    protected JTextField txt_ApeMaterno;
    protected JTextField txt_Nombre;
    protected JTextField txt_Descripcion;
    protected JTextField txt_NumDoc;
    protected JTextField txt_TelFijo;
    protected JTextField txt_TelMovil;
    protected JTextField txt_Email;
    protected JTextField txt_TasaDscto;
    protected JTextField txt_Percepcion;
    protected JTextField txt_Direccion;
    protected JTextField txt_Id_Empresa;
    protected JTextField txt_Id_TipoAnexo;
    protected JComboBox cb_TipoDocIden;
    protected List<BeanTipoDocIden> xtipodociden;
    protected JComboBox cb_Nacionalidad;
    protected List<Nacionalidad> xnacionalidad;
    protected JComboBox cb_EstadoCivil;
    protected List<BeanEstadoCivil> xestadocivil;
    protected CTextArea txta_Comentario;
    protected CScrollPane jsp_Comentario;
    protected String numdoc;
    protected Gif gif;
    protected boolean saliodelTab;
    protected JCheckBox ck_AgPercepcion;
    protected JCheckBox ck_BuenContribuyente;
    protected JCheckBox chk_agretencion;
    protected JTabbedPane tabb;
    protected Usuario usuario;
    protected JLabel lbl_Descripcion;
    protected JLabel lbl_EstadoCivil;
    protected JComboBox cb_clasificacion;
    protected FormPanelConfigPadronProveedor formConfigPadron;
    protected final Logger logger = Logger.getLogger(UiRegisterProveedor.class);

    public UiRegisterProveedor(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public UiRegisterProveedor(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    protected void inicialize() {
        gif = new Gif();

        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245, 245, 245));

        tabb = new JTabbedPane();
        tabb.addKeyListener(this);
        tabb.addFocusListener(this);

        tabb.addTab("General", getPanel1());

        JPanel pnlComentario = new JPanel();
        pnlComentario.setBackground(new Color(245, 245, 245));
        pnlComentario.setLayout(new BorderLayout());
        pnlComentario.setBorder(new EmptyBorder(20, 20, 20, 20));

        CLabel lbl_Comentario = new CLabel("Comentarios :");
        pnlComentario.add(lbl_Comentario, "North");

        txta_Comentario = new CTextArea();
        txta_Comentario.addKeyListener(this);

        jsp_Comentario = new CScrollPane();
        jsp_Comentario.getViewport().add(txta_Comentario);
        pnlComentario.add(this.jsp_Comentario, "Center");

        tabb.addTab("Comentarios", pnlComentario);

        tabb.setBounds(10, 10, 815, 435);

        formConfigPadron = new FormPanelConfigPadronProveedor(this);
        tabb.addTab("", formConfigPadron);
        tabb.setTitleAt(2, "Configurar Padrones");

        //añadir almacenes de proveedores
        tabb.addTab("", getPanelDireccion());
        tabb.setTitleAt(3, "Direcciones");
        //
        pnl_dialog.add(tabb);

        setTitleName("Proveedor");
        setRegister(pnl_dialog);
        setSize(new Dimension(860, 530));
        ComponentToolKit.centerComponentPosicion(this);
    }
    //Direcciones de proveedores
    protected JButton btn_AgregarDireccion;
    protected JButton btn_QuitarDireccion;
    protected ProveedorDireccionTableModel modeltableProveedorDireccion;
    protected TableRowSorter modeloOrdenadoClienteDireccion;
    protected JScrollPane scrollClienteDireccion;
    protected CTable tableProveedorDireccion;

    protected JPanel getPanelDireccion() {
        JPanel pnlDireccion = new JPanel(new BorderLayout());
        pnlDireccion.setLayout(new BorderLayout(0, 0));
        pnlDireccion.setBackground(new Color(245, 245, 245));

        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setPreferredSize(new Dimension(0, 30));

        btn_AgregarDireccion = new JButton("Agregar", gif.ADD16);
        btn_AgregarDireccion.setMnemonic('A');
        btn_AgregarDireccion.setHorizontalAlignment(SwingConstants.LEFT);
        btn_AgregarDireccion.setIconTextGap(10);
        btn_AgregarDireccion.addActionListener(this);
        btn_AgregarDireccion.setOpaque(false);
        btn_AgregarDireccion.addKeyListener(this);
        btn_AgregarDireccion.setFocusPainted(false);
        btn_AgregarDireccion.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btn_AgregarDireccion);

        toolbar.addSeparator();

        btn_QuitarDireccion = new JButton("Quitar", gif.ELIMINATE16);
        btn_QuitarDireccion.setMnemonic('Q');
        btn_QuitarDireccion.setHorizontalAlignment(SwingConstants.LEFT);
        btn_QuitarDireccion.setIconTextGap(10);
        btn_QuitarDireccion.addActionListener(this);
        btn_QuitarDireccion.setOpaque(false);
        btn_QuitarDireccion.addKeyListener(this);
        btn_QuitarDireccion.setFocusPainted(false);
        btn_QuitarDireccion.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btn_QuitarDireccion);

        pnlDireccion.add(toolbar, BorderLayout.NORTH);

        modeltableProveedorDireccion = new ProveedorDireccionTableModel();
        modeloOrdenadoClienteDireccion = new TableRowSorter(modeltableProveedorDireccion);
        tableProveedorDireccion = new CTable();
        tableProveedorDireccion.setRowSorter(modeloOrdenadoClienteDireccion);
        tableProveedorDireccion.setModel(modeltableProveedorDireccion);
        tableProveedorDireccion.setAllTableNoEditable();
        tableProveedorDireccion.setAllColumnNoResizable();
        tableProveedorDireccion.setRendererColumnZero();
        tableProveedorDireccion.setAllColumnPreferredWidth();
        tableProveedorDireccion.getSelectionModel().addListSelectionListener(this);
        scrollClienteDireccion = new JScrollPane(tableProveedorDireccion);
        scrollClienteDireccion.setPreferredSize(new Dimension(1200, 380));

        pnlDireccion.add(scrollClienteDireccion, BorderLayout.CENTER);
        return pnlDireccion;
    }

    protected void cargarTabla() {
    }

    protected JPanel getPanel1() {
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
        txt_Codigo.setEditable(false);
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
        cb_TipoDocIden = new JComboBox();
        cb_TipoDocIden.setFont(new Font(Font.SANS_SERIF, 0, 9));
        //cb_TipoDocIden.addKeyListener(this);estaba activado
        //cb_TipoDocIden.addActionListener(this);estaba activado
        gbc.gridx = 1;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(cb_TipoDocIden, gbc);
        JLabel lbl_NumDoc = new JLabel("DNI/RUC");
        gbc.gridx = 2;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_NumDoc, gbc);
        txt_NumDoc = new JTextField();
        //txt_NumDoc.addFocusListener(this);
        //txt_NumDoc.addKeyListener(this);
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
        txt_ApePaterno.setDocument(new UpperCaseDocument(180));
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
        txt_ApeMaterno.setDocument(new UpperCaseDocument(180));
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
        txt_Nombre.setDocument(new UpperCaseDocument(180));
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
        JPanel panelSexo = new JPanel();
        panelSexo.setLayout(flow);
        JLabel lbl_Sexo = new JLabel("Sexo");
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

        rb_SexoNinguno = new CRadioButton();
        rb_SexoNinguno.addKeyListener(this);
        bg_Sexo = new ButtonGroup();
        bg_Sexo.add(rb_SexoFemenino);
        bg_Sexo.add(rb_SexoMasculino);
        bg_Sexo.add(rb_SexoNinguno);

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
        txt_TelMovil.addKeyListener(this);
        txt_TelMovil.addFocusListener(this);
        gbc.gridx = 3;
        gbc.gridy = 7;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(txt_TelMovil, gbc);

        JLabel lbl_Nacionalidad = new JLabel("Nacionalidad");
        gbc.gridx = 0;
        gbc.gridy = 8;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_Nacionalidad, gbc);

        cb_Nacionalidad = new JComboBox();
        cb_Nacionalidad.setFont(new Font(Font.SANS_SERIF, 0, 9));
        cb_Nacionalidad.addKeyListener(this);
        gbc.gridx = 1;
        gbc.gridy = 8;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(cb_Nacionalidad, gbc);

        lbl_EstadoCivil = new JLabel("Estado Civil");
        gbc.gridx = 2;
        gbc.gridy = 8;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_EstadoCivil, gbc);

        cb_EstadoCivil = new JComboBox();
        cb_EstadoCivil.setFont(new Font(Font.SANS_SERIF, 0, 9));
        cb_EstadoCivil.addKeyListener(this);
        gbc.gridx = 3;
        gbc.gridy = 8;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(cb_EstadoCivil, gbc);

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

        JPanel panelPatrones = new JPanel();
        panelPatrones.setLayout(flow);
        ck_AgPercepcion = new JCheckBox("A Percepcion");
        ck_AgPercepcion.addKeyListener(this);
        ck_AgPercepcion.setHorizontalTextPosition(SwingConstants.LEFT);
        ck_AgPercepcion.addFocusListener(this);
        ck_AgPercepcion.addItemListener(this);
        ck_AgPercepcion.setOpaque(false);
        panelPatrones.add(ck_AgPercepcion);
        ck_BuenContribuyente = new JCheckBox("Buen Contribuyente");
        ck_BuenContribuyente.addKeyListener(this);
        ck_BuenContribuyente.setHorizontalTextPosition(SwingConstants.LEFT);
        ck_BuenContribuyente.addFocusListener(this);
        ck_BuenContribuyente.addItemListener(this);
        ck_BuenContribuyente.setOpaque(false);
        panelPatrones.add(ck_BuenContribuyente);
        ck_BuenContribuyente.setVisible(true);
        chk_agretencion = new JCheckBox("A Retencion");
        chk_agretencion.addKeyListener(this);
        chk_agretencion.setHorizontalTextPosition(SwingConstants.LEFT);
        chk_agretencion.addFocusListener(this);
        chk_agretencion.addItemListener(this);
        chk_agretencion.setOpaque(false);
        panelPatrones.add(chk_agretencion);

        gbc.gridx = 0;
        gbc.gridy = 10;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        gbc.gridwidth = 3;
        pnlGeneral.add(panelPatrones, gbc);

        JLabel lbl_clasificacion = new JLabel("Clasificación");
        gbc.gridx = 0;
        gbc.gridy = 11;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.gridwidth = 1;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_clasificacion, gbc);
        lbl_clasificacion.setVisible(false);
        cb_clasificacion = new JComboBox();
        cb_clasificacion.setFont(new Font(Font.SANS_SERIF, 0, 9));
        cb_clasificacion.addKeyListener(this);
        gbc.gridx = 1;
        gbc.gridy = 11;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(cb_clasificacion, gbc);
        lbl_clasificacion.setVisible(false);
        cb_clasificacion.setVisible(false);
        JLabel lbl_EstadoAnexo = new JLabel("Estado");
        gbc.gridx = 2;
        gbc.gridy = 11;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_EstadoAnexo, gbc);
        lbl_EstadoAnexo.setVisible(false);
        JLabel lbl_TasaDscto = new JLabel("Tasa de Descuento");
        gbc.gridx = 0;
        gbc.gridy = 12;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_TasaDscto, gbc);

        txt_TasaDscto = new JTextField();
        txt_TasaDscto.addKeyListener(this);
        txt_TasaDscto.addFocusListener(this);
        txt_TasaDscto.setDocument(new DoubleDocument());
        gbc.gridx = 1;
        gbc.gridy = 12;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(txt_TasaDscto, gbc);
        lbl_TasaDscto.setVisible(false);
        txt_TasaDscto.setVisible(false);

        JLabel lbl_TipoPersona = new JLabel("Tipo de Persona");
        gbc.gridx = 0;
        gbc.gridy = 13;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_TipoPersona, gbc);
        lbl_TipoPersona.setVisible(false);
        rb_TipoPersonaNatural = new CRadioButton("Natural");
        rb_TipoPersonaNatural.addKeyListener(this);
        rb_TipoPersonaNatural.addActionListener(this);
        rb_TipoPersonaNatural.addItemListener(this);
        gbc.gridx = 1;
        gbc.gridy = 13;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(rb_TipoPersonaNatural, gbc);
        rb_TipoPersonaNatural.setVisible(false);
        rb_TipoPersonaJuridica = new CRadioButton("Juridica");
        rb_TipoPersonaJuridica.addKeyListener(this);
        rb_TipoPersonaJuridica.addActionListener(this);
        rb_TipoPersonaJuridica.addItemListener(this);
        gbc.gridx = 2;
        gbc.gridy = 13;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(rb_TipoPersonaJuridica, gbc);
        rb_TipoPersonaJuridica.setVisible(false);
        txt_Id_TipoAnexo = new JTextField();
        txt_Id_TipoAnexo.setVisible(false);
        gbc.gridx = 0;
        gbc.gridy = 14;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(txt_Id_TipoAnexo, gbc);

        txt_Id_Empresa = new JTextField();
        txt_Id_Empresa.setVisible(false);
        gbc.gridx = 1;
        gbc.gridy = 14;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(txt_Id_Empresa, gbc);

        rb_TipoPersonaNinguno = new CRadioButton();
        rb_TipoPersonaNinguno.addKeyListener(this);

        bg_TipoPersona = new ButtonGroup();
        bg_TipoPersona.add(rb_TipoPersonaJuridica);
        bg_TipoPersona.add(rb_TipoPersonaNatural);
        bg_TipoPersona.add(rb_TipoPersonaNinguno);

        cb_TipoDocIden.addItemListener(itemListener);
        txt_NumDoc.addKeyListener(key);
        txt_ApePaterno.addKeyListener(key);
        txt_ApeMaterno.addKeyListener(key);
        txt_Nombre.addKeyListener(key);
        txt_NumDoc.setInputVerifier(new ValidDocumento(cb_TipoDocIden));
        txt_NumDoc.addFocusListener(focusListener);
        return pnlGeneral;
    }
    FocusListener focusListener = new FocusListener() {
        public void focusGained(FocusEvent e) {
        }

        @Override
        public void focusLost(FocusEvent e) {
            validarDocumento();
            if (String.valueOf(cb_TipoDocIden.getSelectedItem()).equalsIgnoreCase("RUC")) {
                try {
                    char val = txt_NumDoc.getText().charAt(0);
                    if (val == '2') {
                        HashMap<String, String> array = verificarRuc(txt_NumDoc.getText());
                        txt_Descripcion.setText(array.get("RAZONSOCIAL"));
                        txt_Direccion.setText(array.get("DIRECCION"));
                    } else if (val == '1') {
                        HashMap<String, String> array = verificarRuc(txt_NumDoc.getText());
                        String razon = array.get("RAZONSOCIAL");
                        txt_Descripcion.setText(razon);
                        int valor1 = razon.indexOf(" ");
                        txt_ApePaterno.setText(razon.substring(0, valor1));
                        int valor2 = razon.indexOf(" ", valor1 + 1);
                        txt_ApeMaterno.setText(razon.substring(valor1 + 1, valor2));
                        txt_Nombre.setText(razon.substring(valor2, razon.length()));
                        txt_Direccion.setText(array.get("DIRECCION"));
                    }
                } catch (IOException ex) {
                    ExceptionHandler.handleException(ex, logger);
                    JOptionPane.showMessageDialog(null, ex.getMessage());
                } catch (Exception ex) {
                    ExceptionHandler.handleException(ex, logger);
                    JOptionPane.showMessageDialog(null, ex.getMessage());
                }
            }
        }
    };

    public HashMap<String, String> verificarRuc(String ruc) throws IOException, Exception {
        return null;
    }
    KeyListener key = new KeyListener() {
        public void keyTyped(KeyEvent e) {
            if (e.getSource().equals(txt_NumDoc)) {
                if (String.valueOf(cb_TipoDocIden.getSelectedItem()).equalsIgnoreCase("DNI")) {
                    if (txt_NumDoc.getText().length() == 8) {
                        e.consume();
                    }
                } else if (String.valueOf(cb_TipoDocIden.getSelectedItem()).equalsIgnoreCase("RUC")) {
                    if (txt_NumDoc.getText().length() == 11) {
                        e.consume();
                    }
                } else {
                    e.consume();
                }
            }

        }

        public void keyPressed(KeyEvent e) {
            if (cb_TipoDocIden.getSelectedIndex() == -1 || cb_TipoDocIden.getSelectedIndex() == 0) {
                JOptionPane.showMessageDialog(null, "SELECCIONE EL TIPO DE DOCUMENTO.");
            }

        }

        public void keyReleased(KeyEvent e) {
            if (e.getSource().equals(txt_NumDoc)) {
                validarDocumento();
            }

        }
    };

    protected void validarDocumento() {
    }
    ItemListener itemListener = new ItemListener() {
        public void itemStateChanged(ItemEvent e) {
            if (String.valueOf(cb_TipoDocIden.getSelectedItem()).equalsIgnoreCase("DNI")) {
                txt_ApePaterno.setEnabled(true);
                txt_ApeMaterno.setEnabled(true);
                txt_Nombre.setEnabled(true);
                txt_Descripcion.setEnabled(false);
                txt_NumDoc.setEnabled(true);
                txt_NumDoc.setText(null);
                txt_NumDoc.requestFocus();
                rb_TipoPersonaNatural.setSelected(true);
                rb_SexoMasculino.setEnabled(true);
                rb_SexoFemenino.setEnabled(true);
                cb_EstadoCivil.setSelectedIndex(0);
                cb_EstadoCivil.setEnabled(true);
                lbl_Descripcion.setVisible(false);
                txt_Descripcion.setVisible(false);
            } else {
                txt_Descripcion.setEnabled(true);
                txt_NumDoc.setEnabled(true);
                txt_ApeMaterno.setEnabled(true);
                txt_NumDoc.setText(null);
                txt_NumDoc.requestFocus();
                lbl_Descripcion.setVisible(true);
                txt_Descripcion.setVisible(true);
            }
            //if (txt_Codigo.getText().isEmpty() || txt_Codigo.getText() == null || txt_Codigo.getText().equals("")) {
            txt_ApeMaterno.setText(null);
            txt_ApePaterno.setText(null);
            txt_Nombre.setText(null);
            txt_Descripcion.setText(null);
            //}
            txt_NumDoc.setText(null);
        }
    };

    @Override
    public void loadCombo() {
    }

    public void loadTipoDocIden() throws Exception {
    }

    protected void loadEstadoCivil() throws Exception {
    }

    protected void loadNacionalidad() throws Exception {
    }

    public void newRegister() {
    }

    public String executeInsert() {
        return null;
    }

    public void focusGained(FocusEvent e) {
        if (e.getComponent() == tabb) {
            saliodelTab = false;
        }

        if (e.getComponent() == txt_ApePaterno) {
            txt_ApePaterno.selectAll();
        }

        if (e.getComponent() == txt_ApeMaterno) {
            txt_ApeMaterno.selectAll();
        }

        if (e.getComponent() == txt_Nombre) {
            txt_Nombre.selectAll();
        }

        if (e.getComponent() == txt_Direccion) {
            txt_Direccion.selectAll();
        }

        if (e.getComponent() == txt_Descripcion) {
            txt_Descripcion.selectAll();
        }

        if (e.getComponent() == txt_NumDoc) {
            txt_NumDoc.selectAll();
        }

        if (e.getComponent() == txt_TelFijo) {
            txt_TelFijo.selectAll();
        }

        if (e.getComponent() == txt_TelMovil) {
            txt_TelMovil.selectAll();
        }

        if (e.getComponent() == txt_Email) {
            txt_Email.selectAll();
        }

        if (e.getComponent() == txt_TasaDscto) {
            txt_TasaDscto.selectAll();
        }
    }

    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }

        if (e.getKeyChar() == '\n') {
            if (tabb.getSelectedIndex() == 0) {
                if (!saliodelTab) {
                    rb_TipoPersonaNatural.requestFocus();
                    saliodelTab = true;
                }
            }

            if (e.getSource() == rb_TipoPersonaNatural) {
                rb_TipoPersonaJuridica.requestFocus();
            }

            if (e.getSource() == rb_TipoPersonaJuridica) {
                if (txt_ApePaterno.isEditable()) {
                    txt_ApePaterno.requestFocus();
                } else {
                    txt_Descripcion.requestFocus();
                }
            }

            if (e.getSource() == txt_ApePaterno) {
                txt_ApeMaterno.requestFocus();
            }

            if (e.getSource() == txt_ApeMaterno) {
                txt_Nombre.requestFocus();
            }

            if (e.getSource() == txt_Nombre) {
                txt_Direccion.requestFocus();
            }

            if (e.getSource() == txt_Descripcion) {
                txt_Direccion.requestFocus();
            }

            if (e.getSource() == txt_Direccion) {
                cb_TipoDocIden.requestFocus();
            }

            if (e.getSource() == cb_TipoDocIden) {
                if (txt_NumDoc.isEditable()) {
                    txt_NumDoc.requestFocus();
                } else {
                    txt_TelFijo.requestFocus();
                }
            }

            if (e.getSource() == txt_NumDoc) {
                txt_TelFijo.requestFocus();
            }

            if (e.getSource() == txt_TelFijo) {
                txt_TelMovil.requestFocus();
            }

            if (e.getSource() == txt_TelMovil) {
                cb_Nacionalidad.requestFocus();
            }

            if (e.getSource() == cb_Nacionalidad) {
                if (cb_EstadoCivil.isEnabled()) {
                    cb_EstadoCivil.requestFocus();
                } else {
                    txt_Email.requestFocus();
                }
            }

            if (e.getSource() == cb_EstadoCivil) {
                txt_Email.requestFocus();
            }

            if (e.getSource() == txt_Email) {
                if (rb_SexoFemenino.isEnabled()) {
                    rb_SexoFemenino.requestFocus();
                } else {
                    txt_TasaDscto.requestFocus();
                }
            }

            if (e.getSource() == rb_SexoFemenino) {
                rb_SexoMasculino.requestFocus();
            }

            if (e.getSource() == rb_SexoMasculino) {
                txt_TasaDscto.requestFocus();
            }

            if (e.getSource() == txt_TasaDscto) {
                ck_AgPercepcion.requestFocus();
            }

            if (e.getSource() == ck_AgPercepcion) {
                chk_agretencion.requestFocus();
            }

            if (e.getSource() == chk_agretencion) {
                ck_BuenContribuyente.requestFocus();
            }
            if (tabb.getSelectedIndex() == 1) {
                txta_Comentario.requestFocus();
            }
        } else if (e.getKeyChar() == KeyEvent.VK_SPACE) {
            if (e.getSource() == rb_TipoPersonaNatural) {
                rb_TipoPersonaNatural.setSelected(true);
                txt_ApePaterno.requestFocus();
            }

            if (e.getSource() == rb_TipoPersonaJuridica) {
                rb_TipoPersonaJuridica.setSelected(true);
                txt_Descripcion.requestFocus();
            }

            if (e.getSource() == rb_SexoMasculino) {
                rb_SexoMasculino.setSelected(true);
                txt_TasaDscto.requestFocus();
            }

            if (e.getSource() == rb_SexoMasculino) {
                rb_SexoFemenino.setSelected(true);
                txt_TasaDscto.requestFocus();
            }
        }
    }

    public boolean isRegisterValid() {
        return false;
    }
    public Anexo objAnexo = new Anexo();

    public boolean loadRegister() {
        return false;
    }

    public void cargarTipoDocIden(String xcodiTipodocIden) {
    }

    public void cargarNacionalidad(String xcodnacionalidad) {
    }

    public void cargarEstadoCivil(String xcodestadocivil) {
    }

    public String executeUpdate() {
        return null;
    }

    public boolean executeDelete() {
        return false;
    }

    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == cb_TipoDocIden) {
            txt_NumDoc.setDocument(cb_TipoDocIden.getSelectedItem().equals("DNI") ? new IntegerDocument(8) : (cb_TipoDocIden.getSelectedItem().equals("RUC") ? new IntegerDocument(11) : new JTextField().getDocument()));

            if (cb_TipoDocIden.getSelectedIndex() > 0) {
                if ((mode == UPDATE) || (mode == INSERT) || (mode == CLONE)) {
                    txt_NumDoc.setEditable(true);
                }
            } else {
                txt_NumDoc.setEditable(false);
            }
        }
        if (btn_AgregarDireccion == e.getSource()) {
            FormDireccionProveedor frmClienteDireccion = new FormDireccionProveedor(this, path, btn_AgregarDireccion);
            frmClienteDireccion = null;
        }
        if (btn_QuitarDireccion == e.getSource()) {
            quitarDireccion();
        }
    }

    protected void quitarDireccion() {
    }

    public void setRegisterEnabled(boolean e) {
        chk_agretencion.setEnabled(false);
        cb_EstadoCivil.setEnabled(e);
        cb_Nacionalidad.setEnabled(e);
        cb_TipoDocIden.setEnabled(e);
        rb_SexoFemenino.setEnabled(e);
        rb_SexoMasculino.setEnabled(e);
        rb_TipoPersonaJuridica.setEnabled(e);
        rb_TipoPersonaNatural.setEnabled(e);
        ck_AgPercepcion.setEnabled(false);
        ck_BuenContribuyente.setEnabled(false);
        if (txt_Codigo.getText() == null || txt_Codigo.getText().equals("") || txt_Codigo.getText().isEmpty()) {
            cb_TipoDocIden.setEnabled(e);
        } else {
            cb_TipoDocIden.setEnabled(!e);
        }
    }

    public void setRegisterEditable(boolean e) {
        txt_ApeMaterno.setEditable(e);
        txt_ApePaterno.setEditable(e);
        txt_Descripcion.setEditable(e);
        txt_Direccion.setEditable(e);
        txt_Email.setEditable(e);
        txt_Nombre.setEditable(e);
        txt_NumDoc.setEditable(e);
        txt_TasaDscto.setEditable(e);
        txt_TelFijo.setEditable(e);
        txt_TelMovil.setEditable(e);
        txta_Comentario.setEditable(e);
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_TasaDscto && txt_TasaDscto.getText().trim().length() == 0) {
            txt_TasaDscto.setText("0.0");
        }
    }

    public void keyReleased(KeyEvent e) {
        if (e.getSource() == txt_ApeMaterno || e.getSource() == txt_ApePaterno || e.getSource() == txt_Nombre) {
            String descripcionT = txt_ApePaterno.getText().trim() + " " + txt_ApeMaterno.getText().trim() + " " + txt_Nombre.getText().trim();

            txt_Descripcion.setText(descripcionT);
        }
    }

    public void itemStateChanged(ItemEvent e) {
        boolean is_Selected;

        is_Selected = (e.getStateChange() == ItemEvent.SELECTED);

        if (e.getItemSelectable() == rb_TipoPersonaJuridica) {
            if (is_Selected) //activarCamposDatos(false);
            {
                if (e.getItemSelectable() == rb_TipoPersonaNatural) {
                    if (is_Selected) //activarCamposDatos(true);
                    {
                        if (e.getItemSelectable() == ck_AgPercepcion) {
                            if (is_Selected) {
                                //ck_BuenContribuyente.setSelected(false);
                                //chk_agretencion.setSelected(false);
                            }
                        }
                    }
                }
            }
        }

        if (e.getItemSelectable() == ck_BuenContribuyente) {
            if (is_Selected) {
                //ck_AgPercepcion.setSelected(false);
                //chk_agretencion.setSelected(false);
            }
        }

        if (e.getItemSelectable() == chk_agretencion) {
            if (is_Selected) {
                //ck_AgPercepcion.setSelected(false);
                //ck_BuenContribuyente.setSelected(false);
            }
        }
    }

    protected void activarCamposDatos(boolean e) {
        JTextField txt = new JTextField();
        txt_ApePaterno.setBorder(txt.getBorder());
        txt_Nombre.setBorder(txt.getBorder());
        txt_Descripcion.setBorder(txt.getBorder());
        txt_NumDoc.setBorder(txt.getBorder());
        cb_TipoDocIden.setBorder(txt.getBorder());
        rb_TipoPersonaJuridica.setForeground(txt.getForeground());
        rb_TipoPersonaNatural.setForeground(txt.getForeground());

        txt_ApeMaterno.setText("");
        txt_ApePaterno.setText("");
        txt_Nombre.setText("");
        txt_Descripcion.setText("");
        cb_EstadoCivil.setSelectedIndex(0);
        rb_SexoNinguno.setSelected(true);

        if (mode == INSERT || mode == UPDATE || mode == CLONE) {
            txt_ApeMaterno.setEditable(e);
            txt_ApePaterno.setEditable(e);
            txt_Nombre.setEditable(e);
            txt_Descripcion.setEditable(e);
        }

        rb_SexoFemenino.setVisible(e);
        rb_SexoMasculino.setVisible(e);
        lbl_EstadoCivil.setVisible(e);
        cb_EstadoCivil.setVisible(e);
    }

    public FormPanelConfigPadronProveedor getFormConfigPadron() {
        return formConfigPadron;
    }

    public JTextField getTxt_Codigo() {
        return txt_Codigo;
    }

    @Override
    public void showMessageSuccessfulUpdate() {
    }

    @Override
    public void showMessageSuccessfulDelete() {
    }

    @Override
    public void showMessageErrorInsert() {
    }

    @Override
    public void showMessageErrorUpdate() {
    }

    @Override
    public void showMessageErrorDelete() {
    }

    public boolean executeAnular() {
        return false;
    }

    public boolean executeSelect() {
        return false;
    }

    public void keyTyped(KeyEvent e) {
    }

    public void windowOpened(WindowEvent e) {
    }

    public void windowClosing(WindowEvent e) {
    }

    public void windowClosed(WindowEvent e) {
    }

    public void windowIconified(WindowEvent e) {
    }

    public void windowDeiconified(WindowEvent e) {
    }

    public void windowActivated(WindowEvent e) {
    }

    public void windowDeactivated(WindowEvent e) {
    }

    public void mouseClicked(MouseEvent e) {
    }

    public void mousePressed(MouseEvent e) {
    }

    public void mouseReleased(MouseEvent e) {
    }

    public void showMessagePrint(String codigo) {
    }

    public void mouseEntered(MouseEvent e) {
    }

    public void mouseExited(MouseEvent e) {
    }

    public void executeQuitar(Object ob, ActionEvent e) {
    }

    public void executeEditar(Object ob, ActionEvent e) {
    }

    public void executeEditar(Object ob, MouseEvent e) {
    }

    public void executeDetalle(Object ob, ActionEvent E) {
    }

    public void executeAgregar(ActionEvent e) {
    }

    public void executeExit() {
    }

    public void onFocusOKB(int boton) {
    }

    @Override
    public void showMessageSuccessfulInsert() {
    }

    public void tableChanged(TableModelEvent e) {
    }

    public void valueChanged(ListSelectionEvent e) {
    }

    @Override
    public boolean loadRegister(Object o) {
        return false;
    }
}
