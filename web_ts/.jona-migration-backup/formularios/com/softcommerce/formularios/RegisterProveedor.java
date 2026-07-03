package com.softcommerce.formularios;

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

public class RegisterProveedor
        extends JHDialog
        implements ActionListener, ItemListener, KeyListener, WindowListener, MouseListener, FocusListener, TableModelListener, ListSelectionListener {

    private ButtonGroup bg_TipoPersona;
    private CRadioButton rb_TipoPersonaNatural;
    private CRadioButton rb_TipoPersonaJuridica;
    private CRadioButton rb_TipoPersonaNinguno;
    private ButtonGroup bg_Sexo;
    private CRadioButton rb_SexoMasculino;
    private CRadioButton rb_SexoFemenino;
    private CRadioButton rb_SexoNinguno;
    private JTextField txt_Codigo;
    private JTextField txt_ApePaterno;
    private JTextField txt_ApeMaterno;
    private JTextField txt_Nombre;
    private JTextField txt_Descripcion;
    private JTextField txt_NumDoc;
    private JTextField txt_TelFijo;
    private JTextField txt_TelMovil;
    private JTextField txt_Email;
    private JTextField txt_TasaDscto;
    private JTextField txt_Percepcion;
    private JTextField txt_Direccion;
    private JTextField txt_Id_Empresa;
    private JTextField txt_Id_TipoAnexo;
    private JComboBox cb_TipoDocIden;
    private List<BeanTipoDocIden> xtipodociden;
    private JComboBox cb_Nacionalidad;
    private List<Nacionalidad> xnacionalidad;
    private JComboBox cb_EstadoCivil;
    private List<BeanEstadoCivil> xestadocivil;
    private CTextArea txta_Comentario;
    private CScrollPane jsp_Comentario;
    private String numdoc;
    private Gif gif;
    private boolean saliodelTab;
    private JCheckBox ck_AgPercepcion;
    private JCheckBox ck_BuenContribuyente;
    private JCheckBox chk_agretencion;
    private JTabbedPane tabb;
    private Usuario usuario;
    private JLabel lbl_Descripcion;
    private JLabel lbl_EstadoCivil;
    private JComboBox cb_clasificacion;
    private FormPanelConfigPadronProveedor formConfigPadron;
    private final Logger logger = Logger.getLogger(RegisterProveedor.class);

    public RegisterProveedor(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public RegisterProveedor(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    private void inicialize() {
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
    private JButton btn_AgregarDireccion;
    private JButton btn_QuitarDireccion;
    private ProveedorDireccionTableModel modeltableProveedorDireccion;
    private TableRowSorter modeloOrdenadoClienteDireccion;
    private JScrollPane scrollClienteDireccion;
    private CTable tableProveedorDireccion;

    private JPanel getPanelDireccion() {
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

    private void cargarTabla() {
        LogicDireccionProveedor logica = new LogicDireccionProveedor(path);
        try {
            if (rowSelection != null) {
                modeltableProveedorDireccion.agregarVectorProveedorDireccion(logica.listDireccionProveedor(rowSelection.getSelectedValue(1).toString()));
                this.tableProveedorDireccion.getColumnModel().getColumn(0).setCellRenderer(new CellRendererImageEstado());
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.toString());
        }

    }

    private JPanel getPanel1() {
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
        try {
            PeticionPost post = new PeticionPost("http://www.sunat.gob.pe/w/wapS01Alias");
            post.add("ruc", ruc);
            ArrayList<String> respuesta = post.getRespueta();
            ArrayList<String> datos = new ArrayList();
            Iterator<String> iterador = respuesta.iterator();
            HashMap<String, String> lista = new HashMap();
            String xml;
            while (iterador.hasNext()) {
                xml = iterador.next();
                if (xml.indexOf("<small>") != -1) {
                    datos.add(xml);
                }
            }
            for (int i = 0; i < datos.size(); i++) {
                xml = datos.get(i);
                switch (i) {
                    case 0:
                        xml = xml.replaceAll("<small><b>N&#xFA;mero Ruc. </b>", "");
                        xml = xml.replaceAll("&#209;", "Ñ");
                        xml = xml.replaceAll("&#xF3;", "ó");
                        xml = xml.replaceAll("&#xFA;", "ú");
                        xml = xml.replaceAll("&AMP;", "&");
                        xml = xml.replaceAll("<br/></small>", "");
                        xml = xml.substring(14, xml.length());
                        xml = xml.trim();
                        lista.put("RAZONSOCIAL", xml);
                        System.out.println(xml);
                        break;
                    case 3:
                        xml = xml.replaceAll("<small><b>Estado.</b>", "");
                        xml = xml.replaceAll("</small><br/>", "");
                        xml = xml.trim();
                        lista.put("ESTADO", xml);
                        System.out.println(xml);
                        break;
                    case 6:
                        xml = xml.replaceAll("<small><b>Direcci&#xF3;n.</b><br/>", "");
                        xml = xml.replaceAll("&#209;", "Ñ");
                        xml = xml.replaceAll("&#xF3;", "ó");
                        xml = xml.replaceAll("&#xFA;", "ú");
                        xml = xml.replaceAll("&AMP;", "&");
                        xml = xml.replaceAll("</small><br/>", "");
                        xml = xml.trim();
                        lista.put("DIRECCION", xml);
                        System.out.println(xml);
                        break;
                    case 7:
                        xml = xml.replaceAll("<small>Situaci&#xF3;n.<b>", "");
                        xml = xml.replaceAll("</b></small><br/>", "");
                        xml = xml.trim();
                        lista.put("SITUACION", xml);
                        System.out.println(xml);
                        break;
                    default:
                        break;
                }
            }
            return lista;
        } catch (IOException ex) {
            throw ex;
        } catch (Exception ex) {
            throw ex;
        }
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

    private void validarDocumento() {
        if (String.valueOf(cb_TipoDocIden.getSelectedItem()).equalsIgnoreCase("RUC")) {
            try {
                char val = txt_NumDoc.getText().charAt(0);
                if (val == '1') {
                    txt_Descripcion.setEnabled(false);
                    rb_TipoPersonaNatural.setSelected(true);
                    lbl_Descripcion.setVisible(false);
                    txt_Descripcion.setVisible(false);
                    rb_SexoMasculino.setEnabled(true);
                    rb_SexoFemenino.setEnabled(true);
                    cb_EstadoCivil.setSelectedIndex(0);
                    cb_EstadoCivil.setEnabled(true);
                } else if (val == '2') {
                    lbl_Descripcion.setVisible(true);
                    txt_Descripcion.setVisible(true);
                    txt_ApeMaterno.setText(null);
                    txt_ApePaterno.setText(null);
                    txt_Nombre.setText(null);
                    if (txt_Codigo.getText().isEmpty() || txt_Codigo.getText() == null || txt_Codigo.getText().equals("")) {
                        txt_Descripcion.setText(null);
                    }
                    txt_ApeMaterno.setEnabled(false);
                    txt_ApePaterno.setEnabled(false);
                    txt_Nombre.setEnabled(false);
                    txt_Descripcion.setEnabled(true);
                    rb_TipoPersonaJuridica.setSelected(true);
                    rb_SexoMasculino.setSelected(false);
                    rb_SexoFemenino.setSelected(false);
                    rb_SexoMasculino.setEnabled(false);
                    rb_SexoFemenino.setEnabled(false);
                    cb_EstadoCivil.setSelectedIndex(-1);
                    cb_EstadoCivil.setEnabled(false);
                    txt_Descripcion.requestFocus();
                } else {
                    JOptionPane.showMessageDialog(null, "EL DOCUMENTO RUC EMPIEZA CON 1 Ó 2");
                    txt_NumDoc.setText(null);
                    txt_Descripcion.setEnabled(true);
                    txt_ApeMaterno.setEnabled(true);
                    txt_ApePaterno.setEnabled(true);
                    txt_Nombre.setEnabled(true);
                    rb_SexoMasculino.setEnabled(true);
                    rb_SexoFemenino.setEnabled(true);
                    lbl_Descripcion.setVisible(true);
                    txt_Descripcion.setVisible(true);
                }
            } catch (Exception ex) {
                txt_Descripcion.setEnabled(true);
                txt_ApeMaterno.setEnabled(true);
                txt_ApePaterno.setEnabled(true);
                txt_Nombre.setEnabled(true);
                rb_SexoMasculino.setEnabled(true);
                rb_SexoFemenino.setEnabled(true);
                lbl_Descripcion.setVisible(true);
                txt_Descripcion.setVisible(true);
            }
        } else {
            rb_TipoPersonaNatural.setSelected(true);
        }
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
        try {
            loadTipoDocIden();
            loadEstadoCivil();
            loadNacionalidad();
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadTipoDocIden() throws Exception {
        try {
            RnTipoDocIden regla_TipoDocIden = new RnTipoDocIden(path);

            if (xtipodociden != null) {
                xtipodociden.clear();
            } else {
                xtipodociden = new ArrayList<BeanTipoDocIden>();
            }

            xtipodociden = regla_TipoDocIden.listarTipoDocIden("", "A", "S");

            cb_TipoDocIden.removeAllItems();
            cb_TipoDocIden.addItem("--- Seleccione un Tipo de Documento de Identidad ---");

            for (int i = 0; i < xtipodociden.size(); i++) {
                cb_TipoDocIden.addItem(xtipodociden.get(i).getAbreviatura());
            }

            cb_TipoDocIden.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadEstadoCivil() throws Exception {
        try {
            RnEstadoCivil regla_EstadoCivil = new RnEstadoCivil(path);

            if (xestadocivil != null) {
                xestadocivil.clear();
            } else {
                xestadocivil = new ArrayList<BeanEstadoCivil>();
            }

            cb_EstadoCivil.removeAllItems();
            cb_EstadoCivil.addItem("--- Seleccione un Estado Civil ---");

            xestadocivil = regla_EstadoCivil.listarEstadoCivil("", "A");

            for (int i = 0; i < xestadocivil.size(); i++) {
                cb_EstadoCivil.addItem(xestadocivil.get(i).getDescripcion());
            }

            cb_EstadoCivil.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadNacionalidad() throws Exception {
        try {
            RnNacionalidad regla_Nacionalidad = new RnNacionalidad(path);

            if (xnacionalidad != null) {
                xnacionalidad.clear();
            } else {
                xnacionalidad = new ArrayList<Nacionalidad>();
            }

            xnacionalidad = regla_Nacionalidad.listarUbicacion("");

            cb_Nacionalidad.removeAllItems();
            cb_Nacionalidad.addItem("--- Seleccione una Nacionalidad ---");

            for (int i = 0; i < xnacionalidad.size(); i++) {
                cb_Nacionalidad.addItem(xnacionalidad.get(i).getDescripcion());
            }

            cb_Nacionalidad.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    public void newRegister() {
        saliodelTab = false;

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
        txt_Codigo.setText("");
        txt_Descripcion.setText("");
        txt_Direccion.setText("");
        txt_Email.setText("");
        txt_Id_Empresa.setText(usuario.getCodempresa());
        txt_Id_TipoAnexo.setText("1");
        txt_Nombre.setText("");
        txt_NumDoc.setText("");
        txt_TelFijo.setText("");
        txt_TelMovil.setText("");
        txta_Comentario.setText("");
        txt_TasaDscto.setText("0.0");
        cb_Nacionalidad.setSelectedItem("PERUANA");
        cb_EstadoCivil.setSelectedItem("SOLTERO");
        //cb_TipoDocIden.setSelectedItem("DNI");
        cb_TipoDocIden.setSelectedIndex(0);//DNI
        cb_clasificacion.setSelectedIndex(-1);//ACTIVO

        rb_SexoNinguno.setSelected(true);
        rb_TipoPersonaNatural.setSelected(true);
    }

    public String executeInsert() {
        try {
            Anexo a = new Anexo();

            a.setIdTipoAnexo(txt_Id_TipoAnexo.getText().trim());
            a.setFlagTipoPersona(rb_TipoPersonaJuridica.isSelected() ? "J" : "N");
            a.setDescripcion(txt_Descripcion.getText().trim());
            a.setPaterno(txt_ApePaterno.getText().trim());
            a.setMaterno(txt_ApeMaterno.getText().trim());
            a.setNombres(txt_Nombre.getText().trim());
            a.setIdTipoDoc(cb_TipoDocIden.getSelectedIndex() > 0 ? xtipodociden.get(cb_TipoDocIden.getSelectedIndex() - 1).getId_tipo_doc() : "");
            a.setNumerodoc(txt_NumDoc.getText().trim());
            a.setIdNacionalidad(cb_Nacionalidad.getSelectedIndex() > 0 ? xnacionalidad.get(cb_Nacionalidad.getSelectedIndex() - 1).getCodigo() : "");
            a.setIdEstadoCivil(cb_EstadoCivil.getSelectedIndex() > 0 ? xestadocivil.get(cb_EstadoCivil.getSelectedIndex() - 1).getIdEstadoCivil() : "");
            a.setDireccion(txt_Direccion.getText().trim());
            if (rb_TipoPersonaJuridica.isSelected()) {
                a.setSexo(null);
            } else {
                a.setSexo(rb_SexoMasculino.isSelected() ? "M" : "F");
            }
            a.setTelefono(txt_TelFijo.getText().trim());
            a.setCelular(txt_TelMovil.getText().trim());
            a.setEmail(txt_Email.getText().trim());
            a.setTasadescuento(txt_TasaDscto.getText().trim().length() > 0 ? Double.valueOf(txt_TasaDscto.getText()) : 0.0);
            a.setIdEmpresa(txt_Id_Empresa.getText().trim());
            a.setIdEstado("A");
            if (!String.valueOf(cb_TipoDocIden.getSelectedItem()).equalsIgnoreCase("DNI")) {
                JOptionPane jop = new JOptionPane("¿ES BUEN CONTRIBUYENTE?", JOptionPane.QUESTION_MESSAGE, JOptionPane.YES_NO_OPTION);
                JDialog diag = jop.createDialog(this, "Padrones");
                diag.setDefaultCloseOperation(JDialog.DO_NOTHING_ON_CLOSE);
                diag.setLocationRelativeTo(null);
                diag.setVisible(true);
                int val = Integer.parseInt(jop.getValue().toString());
                //int val = JOptionPane.showConfirmDialog(null, "¿ES EXCEPTUADO?", "PADRONES", JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE);
                if (val == JOptionPane.YES_OPTION) {
                    ck_BuenContribuyente.setSelected(true);
                } else {
                    ck_BuenContribuyente.setSelected(false);
                }
                jop = new JOptionPane("¿ES AGENTE DE PERCEPCIÓN?", JOptionPane.QUESTION_MESSAGE, JOptionPane.YES_NO_OPTION);
                diag = jop.createDialog(this, "Padrones");
                diag.setDefaultCloseOperation(JDialog.DO_NOTHING_ON_CLOSE);
                diag.setLocationRelativeTo(null);
                diag.setVisible(true);
                val = Integer.parseInt(jop.getValue().toString());
                //val = JOptionPane.showConfirmDialog(null, "¿ES AGENTE DE RETENCIÓN?", "PADRONES", JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE);
                if (val == JOptionPane.YES_OPTION) {
                    ck_AgPercepcion.setSelected(true);
                } else {
                    ck_AgPercepcion.setSelected(false);
                }
                jop = new JOptionPane("¿ES AGENTE DE RETENCIÓN?", JOptionPane.QUESTION_MESSAGE, JOptionPane.YES_NO_OPTION);
                diag = jop.createDialog(this, "Padrones");
                diag.setDefaultCloseOperation(JDialog.DO_NOTHING_ON_CLOSE);
                diag.setLocationRelativeTo(null);
                diag.setVisible(true);
                val = Integer.parseInt(jop.getValue().toString());
                //val = JOptionPane.showConfirmDialog(null, "¿ES AGENTE DE PERCEPCIÓN?", "PADRONES", JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE);
                if (val == JOptionPane.YES_OPTION) {
                    chk_agretencion.setSelected(true);
                } else {
                    chk_agretencion.setSelected(false);
                }

            }
            a.setFlagpercepcion(ck_AgPercepcion.isSelected() ? "S" : "N");
            a.setFlagretencion(chk_agretencion.isSelected() ? "S" : "N");
            a.setComentario(txta_Comentario.getText().trim());
            a.setFlagbuencontribuyente(ck_BuenContribuyente.isSelected() ? "S" : "N");
            a.setIdUsuario(usuario.getId_usuario());

            RnAnexo regla = new RnAnexo(path);
            String valor = regla.insertarProveedor(a);
            //direccioness
            List<ProveedorDireccion> lista = modeltableProveedorDireccion.getData();
            LogicDireccionProveedor logica = new LogicDireccionProveedor(path);
            String res = "";
            for (int i = 0; i < lista.size(); i++) {
                ProveedorDireccion obj = lista.get(i);
                if (obj.getOperacion().equals("I") || obj.getOperacion().equals("U")) {
                    obj.setId_proveedor(valor);
                    obj.setId_usuario(usuario.getId_usuario());

                    res = logica.mantDireccionProveedor(obj);
                    if (!res.equals("CORRECTO")) {
                        throw new Exception(res);
                    }
                }
            }
            //

            if (!valor.equalsIgnoreCase("error")) {
                JOptionPane.showMessageDialog(null, "Proveedor Guardado Correctamente");
            } else {
                JOptionPane.showMessageDialog(null, "Error al crear Cliente");
            }
            return valor;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
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
        try {
            JTextField txt = new JTextField();
            txt_ApePaterno.setBorder(txt.getBorder());
            txt_Nombre.setBorder(txt.getBorder());
            txt_Descripcion.setBorder(txt.getBorder());
            txt_NumDoc.setBorder(txt.getBorder());
            cb_TipoDocIden.setBorder(txt.getBorder());
            rb_TipoPersonaJuridica.setForeground(txt.getForeground());
            rb_TipoPersonaNatural.setForeground(txt.getForeground());

            if (!rb_TipoPersonaJuridica.isSelected() && !rb_TipoPersonaNatural.isSelected()) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " " + "un Cliente, debes " + "especificar su Tipo de Persona.", "Datos incompletos del Cliente", 2);

                this.rb_TipoPersonaJuridica.setForeground(Color.red);
                this.rb_TipoPersonaNatural.setForeground(Color.red);
                rb_TipoPersonaNatural.requestFocus();

                return false;
            }

            if (rb_TipoPersonaNatural.isSelected() && txt_ApePaterno.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Cliente, debes " + "especificar su Apellido Paterno.", "Datos incompletos del Cliente", JOptionPane.CANCEL_OPTION);

                txt_ApePaterno.setBorder(new LineBorder(Color.RED));
                txt_ApePaterno.requestFocus();

                return false;
            }

            if (rb_TipoPersonaNatural.isSelected() && txt_Nombre.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Cliente, debes " + "especificar su Nombre.", "Datos incompletos del Cliente", JOptionPane.CANCEL_OPTION);

                txt_Nombre.setBorder(new LineBorder(Color.RED));
                txt_Nombre.requestFocus();

                return false;
            }

            if (txt_Descripcion.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Cliente, debes " + "especificar su Descripcion.", "Datos incompletos del Cliente", JOptionPane.CANCEL_OPTION);

                txt_Descripcion.setBorder(new LineBorder(Color.RED));
                txt_Descripcion.requestFocus();

                return false;
            }

            if (cb_TipoDocIden.getSelectedItem().equals("DNI")) {
                if ((txt_NumDoc.getText().length() > 0) && (this.txt_NumDoc.getText().length() < 8)) {
                    JOptionPane.showMessageDialog(this, "El número de DNI que has especificado no es válida. Compruébala e inténtalo de nuevo.", "Datos incompletos del Proveedor", 2);
                    txt_NumDoc.setBorder(new LineBorder(Color.RED));
                    txt_NumDoc.requestFocus();
                    txt_NumDoc.selectAll();

                    return false;
                }
            }

            if (cb_TipoDocIden.getSelectedItem().equals("RUC")) {
                if ((txt_NumDoc.getText().length() > 0) && (this.txt_NumDoc.getText().length() < 11)) {
                    JOptionPane.showMessageDialog(this, "El número de RUC que has especificado no es válida. Compruébala e inténtalo de nuevo.", "Datos incompletos del Proveedor", 2);
                    txt_NumDoc.setBorder(new LineBorder(Color.RED));
                    txt_NumDoc.requestFocus();
                    txt_NumDoc.selectAll();

                    return false;
                }
            }

            RnAnexo regla = new RnAnexo(path);
            boolean flag = regla.existeAnexo(usuario.getCodempresa(), txt_Id_TipoAnexo.getText().trim(), txt_NumDoc.getText().trim()).equals("S");

            if (((mode == INSERT) && flag)
                    || ((mode == UPDATE) && flag && !txt_NumDoc.getText().trim().equals(numdoc))) {
                JOptionPane.showMessageDialog(this, "El numero de Documento ya se encuentra registrado, por favor ingrese otro Numero de Documento.", "Datos incompletos de Cliente", JOptionPane.CANCEL_OPTION);
                txt_NumDoc.setBorder(new LineBorder(Color.RED));
                txt_NumDoc.requestFocus();

                return false;
            }

            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }
    public Anexo objAnexo = new Anexo();

    public boolean loadRegister() {
        try {
            Anexo a = new Anexo();
            a.setNumeroInicial(-1);
            a.setNumeroFinal(-1);
            a.setIdAnexo(rowSelection.getSelectedValue(1).toString());

            RnAnexo regla_Anexo = new RnAnexo(path);
            objAnexo = a;
            List<Anexo> reg = regla_Anexo.listarAnexo(a);

            if (reg.isEmpty()) {
                return false;
            } else {
                Anexo anexo = reg.get(0);
                formConfigPadron.setBeanAnexo(anexo);
                txt_Codigo.setText(mode == CLONE ? "" : anexo.getIdAnexo());
                txt_Id_Empresa.setText(mode == CLONE ? usuario.getCodempresa() : anexo.getIdEmpresa());
                cargarTipoDocIden(anexo.getIdTipoDoc());
                txt_NumDoc.setText(mode == CLONE ? "" : anexo.getNumerodoc());
                numdoc = anexo.getNumerodoc();
                rb_TipoPersonaNatural.setSelected(anexo.getFlagTipoPersona().equals("N") ? true : false);
                rb_TipoPersonaJuridica.setSelected(anexo.getFlagTipoPersona().equals("J") ? true : false);
                txt_ApePaterno.setText(anexo.getPaterno());
                txt_ApeMaterno.setText(anexo.getMaterno());
                txt_Id_TipoAnexo.setText(anexo.getIdTipoAnexo());
                txt_Nombre.setText(anexo.getNombres());
                txt_Descripcion.setText(anexo.getDescripcion());
                txt_Direccion.setText(anexo.getDireccion());
                txt_TelFijo.setText(anexo.getTelefono());
                txt_TelMovil.setText(anexo.getCelular());
                ck_BuenContribuyente.setSelected(anexo.getFlagbuencontribuyente().equals("S") ? true : false);
                chk_agretencion.setSelected(anexo.getFlagretencion().equals("S") ? true : false);
                cargarNacionalidad(anexo.getIdNacionalidad());
                cargarEstadoCivil(anexo.getIdEstadoCivil());
                txt_Email.setText(anexo.getEmail());
                rb_SexoMasculino.setSelected(anexo.getSexo().equals("MASCULINO") ? true : false);
                rb_SexoFemenino.setSelected(anexo.getSexo().equals("FEMENINO") ? true : false);
                txt_TasaDscto.setText(String.valueOf(anexo.getTasadescuento()));
                ck_AgPercepcion.setSelected(anexo.getFlagpercepcion().equals("S") ? true : false);
                txta_Comentario.setText(anexo.getComentario());

                //
                cargarTabla();
            }

            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    public void cargarTipoDocIden(String xcodiTipodocIden) {
        if (xtipodociden != null) {
            for (int i = 0; i < xtipodociden.size(); i++) {
                if (xtipodociden.get(i).getId_tipo_doc().equals(xcodiTipodocIden)) {
                    cb_TipoDocIden.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public void cargarNacionalidad(String xcodnacionalidad) {
        if (xnacionalidad != null) {
            for (int i = 0; i < xnacionalidad.size(); i++) {
                if (xnacionalidad.get(i).getCodigo().equals(xcodnacionalidad)) {
                    cb_Nacionalidad.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public void cargarEstadoCivil(String xcodestadocivil) {
        if (xestadocivil != null) {
            for (int i = 0; i < xestadocivil.size(); i++) {
                if (xestadocivil.get(i).getIdEstadoCivil().equals(xcodestadocivil)) {
                    cb_EstadoCivil.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public String executeUpdate() {
        try {
            Anexo a = new Anexo();
            a.setIdAnexo(txt_Codigo.getText().trim());
            a.setIdTipoAnexo(txt_Id_TipoAnexo.getText().trim());
            a.setFlagTipoPersona(rb_TipoPersonaJuridica.isSelected() ? "J" : "N");
            a.setDescripcion(txt_Descripcion.getText().trim());
            a.setPaterno(txt_ApePaterno.getText().trim());
            a.setMaterno(txt_ApeMaterno.getText().trim());
            a.setNombres(txt_Nombre.getText().trim());
            a.setIdTipoDoc(cb_TipoDocIden.getSelectedIndex() > 0 ? xtipodociden.get(cb_TipoDocIden.getSelectedIndex() - 1).getId_tipo_doc() : "");
            a.setNumerodoc(txt_NumDoc.getText().trim());
            a.setIdNacionalidad(cb_Nacionalidad.getSelectedIndex() > 0 ? xnacionalidad.get(cb_Nacionalidad.getSelectedIndex() - 1).getCodigo() : "");
            a.setIdEstadoCivil(cb_EstadoCivil.getSelectedIndex() > 0 ? xestadocivil.get(cb_EstadoCivil.getSelectedIndex() - 1).getIdEstadoCivil() : "");
            a.setDireccion(txt_Direccion.getText().trim());
            a.setSexo(rb_SexoMasculino.isSelected() ? "M" : "F");
            a.setTelefono(txt_TelFijo.getText().trim());
            a.setCelular(txt_TelMovil.getText().trim());
            a.setEmail(txt_Email.getText().trim());
            a.setTasadescuento(txt_TasaDscto.getText().trim().length() > 0 ? Double.valueOf(txt_TasaDscto.getText()) : 0.0);
            a.setFlagretencion(chk_agretencion.isSelected() ? "S" : "N");
            a.setFlagpercepcion(ck_AgPercepcion.isSelected() ? "S" : "N");
            a.setComentario(txta_Comentario.getText().trim());
            a.setIdEstado("A");
            a.setIdUsuario(usuario.getId_usuario());
            a.setIdEmpresa(txt_Id_Empresa.getText().trim());
            a.setFlagbuencontribuyente(ck_BuenContribuyente.isSelected() ? "S" : "N");

            RnAnexo regla = new RnAnexo(path);
            //direcciones
            List<ProveedorDireccion> lista = modeltableProveedorDireccion.getData();
            LogicDireccionProveedor logica = new LogicDireccionProveedor(path);
            String res;
            for (int i = 0; i < lista.size(); i++) {
                ProveedorDireccion obj = lista.get(i);
                if (obj.getOperacion().equals("I") || obj.getOperacion().equals("U")) {
                    obj.setId_proveedor(a.getIdAnexo());
                    obj.setId_usuario(usuario.getId_usuario());
                    res = logica.mantDireccionProveedor(obj);
                    if (!res.equals("CORRECTO")) {
                        throw new Exception(res);
                    }
                }
            }
            //
            return regla.modificar(a);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    public boolean executeDelete() {
        try {
            RnAnexo regla = new RnAnexo(path);

            return regla.eliminar(
                    txt_Codigo.getText().trim(), usuario.getId_usuario(), null, null, null, null);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
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

    private void quitarDireccion() {
        if (tableProveedorDireccion.getRowCount() == 0) {
            return;
        }
        if (tableProveedorDireccion.getSelectedRow() >= 0) {
            if (modeltableProveedorDireccion.getProveedorDireccion(tableProveedorDireccion.convertRowIndexToModel(tableProveedorDireccion.getSelectedRow())).isEstado() == false) {
                JOptionPane.showMessageDialog(this, "Direccion ya Esta desactivada", "Proveedor Direccion", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            int xres = JOptionPane.showConfirmDialog(this, "Desea Quitar Direccion?", "Proveedor", JOptionPane.OK_CANCEL_OPTION);
            if (xres == JOptionPane.OK_OPTION) {
                if (modeltableProveedorDireccion.getProveedorDireccion(tableProveedorDireccion.convertRowIndexToModel(tableProveedorDireccion.getSelectedRow())).getOperacion().equals("I")) {
                    modeltableProveedorDireccion.deleteProveedorDireccion(tableProveedorDireccion.convertRowIndexToModel(tableProveedorDireccion.getSelectedRow()));
                } else {
                    modeltableProveedorDireccion.getProveedorDireccion(tableProveedorDireccion.convertRowIndexToModel(tableProveedorDireccion.getSelectedRow())).setEstado(false);
                    modeltableProveedorDireccion.getProveedorDireccion(tableProveedorDireccion.convertRowIndexToModel(tableProveedorDireccion.getSelectedRow())).setOperacion("A");
                }
            }
        } else {
            JOptionPane.showMessageDialog(this, "Para quitar una direccion primero debe seleccionar la fila.", "Quitar Direccion", JOptionPane.INFORMATION_MESSAGE);
        }
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
        if (comp == btn_AgregarDireccion) {
            modeloOrdenadoClienteDireccion.setRowFilter(null);
            modeltableProveedorDireccion.setProveedorDireccion((ProveedorDireccion) valor);
            modeltableProveedorDireccion.fireTableDataChanged();
            ProveedorDireccion obj = modeltableProveedorDireccion.getProveedorDireccion(0);
        }
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

    private void activarCamposDatos(boolean e) {
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
        return true;
    }

    public boolean executeSelect() {
        return true;
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
        return true;
    }
}
