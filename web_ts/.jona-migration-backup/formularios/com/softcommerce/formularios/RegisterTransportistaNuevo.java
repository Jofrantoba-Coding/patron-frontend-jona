/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.formularios;

import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.AnexoActivacion;
import com.softcommerce.beans.BeanMarcaVehiculo;
import com.softcommerce.beans.BeanModeloVehiculo;
import com.softcommerce.beans.Nacionalidad;
import com.softcommerce.beans.BeanTipoDocIden;
import com.softcommerce.beans.BeanVehiculo;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CRadioButton;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.AnexoActivacionTableModel;
import com.softcommerce.general.tablas.VehiculoTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnMarcaVehiculo;
import com.softcommerce.reglasnegocio.RnModeloVehiculo;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.reglasnegocio.RnNacionalidad;
import com.softcommerce.reglasnegocio.RnTipoDocIden;
import com.softcommerce.reglasnegocio.RnVehiculo;
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
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import javax.swing.BorderFactory;
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
import javax.swing.border.Border;
import javax.swing.border.LineBorder;
import javax.swing.border.TitledBorder;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;
import javax.swing.table.TableRowSorter;
import org.apache.log4j.Logger;

public class RegisterTransportistaNuevo
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
    private JCheckBox chk_exeptuado;
    private JCheckBox chkEstado;
    //Activacion de Cliente
    private JButton btn_Activar;
    private JButton btn_Desactivar;
    private CTable tableAnexoActivacion;
    private AnexoActivacionTableModel modeltableAnexoActivacion;
    private TableRowSorter modeloOrdenadoAnexoActivacion;
    private JScrollPane scrollAnexoActivacion;
    //Activacion de Cliente
    private JButton btnAgregar;
    private JButton btnQuitar;
    private CTable tableVehiculo;
    private VehiculoTableModel modeltableVehiculo;
    private JComboBox cboMarca;
    private List<BeanMarcaVehiculo> xMarcaVehiculo;
    private JComboBox cboModelo;
    private List<BeanModeloVehiculo> xModeloVehiculo;
    private JTextField txtPlaca;
    private JTextField txtConstacia;
    private JTextField txtPeso;
    private List<BeanVehiculo> listVehiculo;
    private final Logger logger = Logger.getLogger(RegisterTransportistaNuevo.class);

    public RegisterTransportistaNuevo(Frame arg0, Usuario usuario) {
        super(arg0, true);
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    public RegisterTransportistaNuevo(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    private void inicialize() {
        addWindowListener(this);
        listVehiculo = new ArrayList<BeanVehiculo>();
        gif = new Gif();

        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(new BorderLayout());
        pnl_dialog.setBackground(new Color(245, 245, 245));

        tabb = new JTabbedPane();
        tabb.addKeyListener(this);
        tabb.addFocusListener(this);

        tabb.addTab("General", getPanelDatosGeneral());
        tabb.addTab("Activación de Transportista", getPanelActivacion());
        tabb.addTab("Vehiculo", getPanelVehiculo());

        pnl_dialog.add(tabb);

        //tabb.setBounds(10, 10, 815, 430);
        pnl_dialog.add(tabb, BorderLayout.CENTER);

        setTitleName("Transportista");
        setRegister(pnl_dialog);
        setMinimumSize(new Dimension(860, 450));
        setMaximumSize(new Dimension(860, 450));
        this.pack();
        ComponentToolKit.centerComponentPosicion(this);
    }

    private void initListener() {
        btnAgregar.addActionListener(this);
        btnQuitar.addActionListener(this);
    }

    private JPanel getPanelDatosGeneral() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnlGeneral = new JPanel();
        pnlPrinc.add(pnlGeneral, BorderLayout.WEST);
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
        cbo_TipoDocIden.setEnabled(false);
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
        txt_Direccion.setColumns(35);
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
        gbc.gridx = 0;
        gbc.gridy = 8;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_Nacionalidad, gbc);

        cbo_Nacionalidad = new JComboBox();
        cbo_Nacionalidad.setFont(new Font(Font.SANS_SERIF, 0, 9));
        cbo_Nacionalidad.addKeyListener(this);
        gbc.gridx = 1;
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
        chkEstado.setVisible(false);
        gbc.gridx = 2;
        gbc.gridy = 9;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(chkEstado, gbc);

        JPanel panelPatrones = new JPanel();
        panelPatrones.setLayout(flow);
        chk_agpercepcion = new JCheckBox("A Percepcion");
        chk_agpercepcion.setHorizontalTextPosition(SwingConstants.LEFT);
        chk_agpercepcion.setOpaque(false);
        chk_agpercepcion.setEnabled(false);
        chk_agpercepcion.setVisible(false);
        panelPatrones.add(chk_agpercepcion);
        chk_agretencion = new JCheckBox("A Retencion");
        chk_agretencion.setHorizontalTextPosition(SwingConstants.LEFT);
        chk_agretencion.setOpaque(false);
        chk_agretencion.setEnabled(false);
        chk_agretencion.setVisible(false);
        panelPatrones.add(chk_agretencion);

        chk_exeptuado = new JCheckBox("Exceptuado");
        chk_exeptuado.setHorizontalTextPosition(SwingConstants.LEFT);
        chk_exeptuado.setOpaque(false);
        chk_exeptuado.setEnabled(false);
        chk_exeptuado.setVisible(false);
        panelPatrones.add(chk_exeptuado);

        gbc.gridx = 0;
        gbc.gridy = 10;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        gbc.gridwidth = 3;
        pnlGeneral.add(panelPatrones, gbc);

        return pnlPrinc;
    }

    private JPanel getPanelActivacion() {
        JPanel pnlActivacion = new JPanel(new BorderLayout());
        pnlActivacion.setLayout(new BorderLayout(0, 0));
        pnlActivacion.setBackground(new Color(245, 245, 245));
        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setPreferredSize(new Dimension(0, 30));

        btn_Activar = new JButton("Activar", gif.ADD16);
        btn_Activar.setMnemonic('A');
        btn_Activar.setHorizontalAlignment(SwingConstants.LEFT);
        btn_Activar.setIconTextGap(10);
        btn_Activar.addActionListener(this);
        btn_Activar.setOpaque(false);
        btn_Activar.addKeyListener(this);
        btn_Activar.setFocusPainted(false);
        btn_Activar.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btn_Activar);

        toolbar.addSeparator();

        btn_Desactivar = new JButton("Desactivar", gif.ELIMINATE16);
        btn_Desactivar.setMnemonic('D');
        btn_Desactivar.setHorizontalAlignment(SwingConstants.LEFT);
        btn_Desactivar.setIconTextGap(10);
        btn_Desactivar.addActionListener(this);
        btn_Desactivar.setOpaque(false);
        btn_Desactivar.addKeyListener(this);
        btn_Desactivar.setFocusPainted(false);
        btn_Desactivar.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btn_Desactivar);

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
        scrollAnexoActivacion.setPreferredSize(new Dimension(750, 300));

        pnlActivacion.add(scrollAnexoActivacion, BorderLayout.CENTER);

        return pnlActivacion;
    }

    private JPanel getPanelVehiculo() {
        JPanel pnlActivacion = new JPanel(new BorderLayout());
        pnlActivacion.setLayout(new BorderLayout(0, 0));
        pnlActivacion.setBackground(new Color(245, 245, 245));
        /*JToolBar toolbar = new JToolBar();
         toolbar.setBackground(new Color(245, 245, 245));
         toolbar.setPreferredSize(new Dimension(0, 30));

         btn_Activar = new JButton("Activar", gif.ADD16);
         btn_Activar.setMnemonic('A');
         btn_Activar.setHorizontalAlignment(SwingConstants.LEFT);
         btn_Activar.setIconTextGap(10);
         btn_Activar.addActionListener(this);
         btn_Activar.setOpaque(false);
         btn_Activar.addKeyListener(this);
         btn_Activar.setFocusPainted(false);
         btn_Activar.setFont(new Font(Font.SANS_SERIF, 0, 11));
         toolbar.add(btn_Activar);

         toolbar.addSeparator();

         btn_Desactivar = new JButton("Desactivar", gif.ELIMINATE16);
         btn_Desactivar.setMnemonic('D');
         btn_Desactivar.setHorizontalAlignment(SwingConstants.LEFT);
         btn_Desactivar.setIconTextGap(10);
         btn_Desactivar.addActionListener(this);
         btn_Desactivar.setOpaque(false);
         btn_Desactivar.addKeyListener(this);
         btn_Desactivar.setFocusPainted(false);
         btn_Desactivar.setFont(new Font(Font.SANS_SERIF, 0, 11));
         toolbar.add(btn_Desactivar);

         pnlActivacion.add(toolbar, BorderLayout.NORTH);*/

        modeltableVehiculo = new VehiculoTableModel();
        tableVehiculo = new CTable();
        tableVehiculo.setModel(modeltableVehiculo);
        tableVehiculo.setAllTableNoEditable();
        tableVehiculo.setAllColumnNoResizable();
        tableVehiculo.setRendererColumnZero();
        tableVehiculo.setAllColumnPreferredWidth();
        tableVehiculo.setNoVisibleColumn(1);
        tableVehiculo.setNoVisibleColumn(2);
        tableVehiculo.setNoVisibleColumn(3);
        tableVehiculo.setNoVisibleColumn(6);
        tableVehiculo.setNoVisibleColumn(8);
        tableVehiculo.setNoVisibleColumn(10);
        tableVehiculo.getSelectionModel().addListSelectionListener(this);
        JScrollPane scrollVehiculo = new JScrollPane(tableVehiculo);
        scrollVehiculo.setPreferredSize(new Dimension(750, 250));

        pnlActivacion.add(scrollVehiculo, BorderLayout.CENTER);
        pnlActivacion.add(getPnlVehiculo(), BorderLayout.NORTH);

        return pnlActivacion;
    }

    private JPanel getPnlVehiculo() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnl.setLayout(new GridBagLayout());
        pnlPrinc.add(pnl, BorderLayout.WEST);
        Border border = BorderFactory.createTitledBorder(null, "Datos de Vehiculo", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnlPrinc.setBorder(border);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;
        JLabel lblMarca = new JLabel("Marca");
        pnl.add(lblMarca, gbc);
        cboMarca = new JComboBox();
        gbc.gridx = 1;
        pnl.add(cboMarca, gbc);
        JLabel lblModelo = new JLabel("Modelo");
        gbc.gridx = 2;
        pnl.add(lblModelo, gbc);
        cboModelo = new JComboBox();
        gbc.gridx = 3;
        pnl.add(cboModelo, gbc);
        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblPlaca = new JLabel("Placa");
        pnl.add(lblPlaca, gbc);
        txtPlaca = new JTextField();
        gbc.gridx = 1;
        txtPlaca.setDocument(new UpperCaseNumberDocument(30));
        txtPlaca.setColumns(10);
        pnl.add(txtPlaca, gbc);
        gbc.gridx = 2;
        JLabel lblConstancia = new JLabel("Const inscripcion");
        pnl.add(lblConstancia, gbc);
        txtConstacia = new JTextField();
        gbc.gridx = 3;
        txtConstacia.setDocument(new UpperCaseNumberDocument(30));
        txtConstacia.setColumns(10);
        pnl.add(txtConstacia, gbc);
        gbc.gridx = 4;
        JLabel lblPeso = new JLabel("Peso(KG)");
        pnl.add(lblPeso, gbc);
        txtPeso = new JTextField();
        gbc.gridx = 5;
        txtPeso.setDocument(new IntegerDocument(10));
        txtPeso.setColumns(7);
        txtPeso.setText("0");
        pnl.add(txtPeso, gbc);
        JPanel pnlBot = new JPanel();
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.gridwidth = 6;
        pnl.add(pnlBot, gbc);

        btnAgregar = new JButton("Agregar", gif.ADD16);
        btnAgregar.setMnemonic('A');
        btnAgregar.setHorizontalAlignment(SwingConstants.LEFT);
        btnAgregar.setIconTextGap(10);
        btnAgregar.setOpaque(false);
        btnAgregar.setFocusPainted(false);
        btnAgregar.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlBot.add(btnAgregar);

        btnQuitar = new JButton("Quitar", gif.ELIMINATE16);
        btnQuitar.setMnemonic('Q');
        btnQuitar.setHorizontalAlignment(SwingConstants.LEFT);
        btnQuitar.setIconTextGap(10);
        btnQuitar.setOpaque(false);
        btnQuitar.setFocusPainted(false);
        btnQuitar.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlBot.add(btnQuitar);

        return pnlPrinc;
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

    private Anexo llenarBeanAnexo() {
        Anexo beanAnexo = new Anexo();
        SimpleDateFormat fe = new SimpleDateFormat("dd/MM/yyyy");
        beanAnexo.setIdAnexo(txt_Codigo.getText().trim());
        String flag_tipo_persona = "N";
        char val = txt_NumDoc.getText().charAt(0);
        flag_tipo_persona = (xTipoDocIden.get(cbo_TipoDocIden.getSelectedIndex() - 1).getId_tipo_doc().equals("05") && val == '2') ? "J" : "N";
        beanAnexo.setFlagTipoPersona(flag_tipo_persona);
        beanAnexo.setPaterno(txt_ApePaterno.getText().trim());
        beanAnexo.setMaterno(txt_ApeMaterno.getText().trim());
        beanAnexo.setNombres(txt_Nombre.getText().trim());
        beanAnexo.setDescripcion(txt_Descripcion.getText().trim());
        //TipoDocIden beanTDV = new TipoDocIden();
        beanAnexo.setIdTipoDoc(cbo_TipoDocIden.getSelectedIndex() > 0 ? xTipoDocIden.get(cbo_TipoDocIden.getSelectedIndex() - 1).getId_tipo_doc() : "");
        beanAnexo.setNumerodoc(txt_NumDoc.getText().trim());
        beanAnexo.setDireccion(txt_Direccion.getText().trim());
        beanAnexo.setSexo(rb_SexoMasculino.isSelected() ? "M" : "F");
        beanAnexo.setTelefono(txt_TelFijo.getText().trim());
        beanAnexo.setCelular(txt_TelMovil.getText().trim());
        beanAnexo.setIdNacionalidad(cbo_Nacionalidad.getSelectedIndex() > 0 ? xNacionalidad.get(cbo_Nacionalidad.getSelectedIndex() - 1).getCodigo() : "");
        beanAnexo.setFlagpercepcion(chk_agpercepcion.isSelected() ? "S" : "N");
        beanAnexo.setFlagretencion(chk_agretencion.isSelected() ? "S" : "N");
        beanAnexo.setFlagExceptuado(chk_exeptuado.isSelected() ? "S" : "N");
        beanAnexo.setEstadoanexo(chkEstado.isSelected() ? "A" : "D");
        beanAnexo.setIdUsuario(usuario.getId_usuario());
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
        beanAnexo.setXmlActivacion(xmlActivacion);

        return beanAnexo;
    }

    private String getXmlVehiculo() {
        String xmlVehiculo = "";
        xmlVehiculo = "<?xml version=\"1.0\" ?> ";
        xmlVehiculo += "<VEHICULOS>";
        for (int i = 0; i < modeltableVehiculo.getRowCount(); i++) {
            BeanVehiculo beanVehiculo = modeltableVehiculo.getVehiculo(i);
            if (!beanVehiculo.getOperacion().equals("")) {
                xmlVehiculo += "<VEHICULO>";
                xmlVehiculo += "<ID_VEHICULO>" + beanVehiculo.getId_vehiculo() + "</ID_VEHICULO>";
                xmlVehiculo += "<PLACA>" + beanVehiculo.getPlaca() + "</PLACA>";
                xmlVehiculo += "<CONSTANCIA>" + beanVehiculo.getConstanciainscripcion() + "</CONSTANCIA>";
                xmlVehiculo += "<ID_MARCA>" + beanVehiculo.getBeanMarcaVehiculo().getId_marca() + "</ID_MARCA>";
                xmlVehiculo += "<ID_MODELO>" + beanVehiculo.getBeanModeloVehiculo().getId_modelo() + "</ID_MODELO>";
                xmlVehiculo += "<ESTADO>" + beanVehiculo.getEstado() + "</ESTADO>";
                xmlVehiculo += "<PESO>" + beanVehiculo.getPeso().toString().replace(".", ",") + "</PESO>";
                xmlVehiculo += "<OPERACION>" + beanVehiculo.getOperacion() + "</OPERACION>";
                xmlVehiculo += "</VEHICULO>";
            }
        }
        for (int i = 0; i < listVehiculo.size(); i++) {
            BeanVehiculo beanVehiculo = listVehiculo.get(i);
            if (!beanVehiculo.getOperacion().equals("")) {
                xmlVehiculo += "<VEHICULO>";
                xmlVehiculo += "<ID_VEHICULO>" + beanVehiculo.getId_vehiculo() + "</ID_VEHICULO>";
                xmlVehiculo += "<PLACA>" + beanVehiculo.getPlaca() + "</PLACA>";
                xmlVehiculo += "<CONSTANCIA>" + beanVehiculo.getConstanciainscripcion() + "</CONSTANCIA>";
                xmlVehiculo += "<ID_MARCA>" + beanVehiculo.getBeanMarcaVehiculo().getId_marca() + "</ID_MARCA>";
                xmlVehiculo += "<ID_MODELO>" + beanVehiculo.getBeanModeloVehiculo().getId_modelo() + "</ID_MODELO>";
                xmlVehiculo += "<ESTADO>" + beanVehiculo.getEstado() + "</ESTADO>";
                xmlVehiculo += "<PESO>" + beanVehiculo.getPeso().toString().replace(".", ",") + "</PESO>";
                xmlVehiculo += "<OPERACION>" + beanVehiculo.getOperacion() + "</OPERACION>";
                xmlVehiculo += "</VEHICULO>";
            }
        }
        xmlVehiculo += "</VEHICULOS>";
        System.out.println("xnlVehiculo: " + xmlVehiculo);
        return xmlVehiculo;
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

    private void loadMarca() throws Exception {
        try {
            if (xMarcaVehiculo == null) {
                xMarcaVehiculo = new ArrayList<BeanMarcaVehiculo>();
            } else {
                xMarcaVehiculo.clear();
            }
            RnMarcaVehiculo logic = new RnMarcaVehiculo(path);
            xMarcaVehiculo.addAll(logic.listarMarcaVehiculo("", "A"));
            cboMarca.removeAllItems();
            cboMarca.addItem("-- SELECCIONE --");
            for (int i = 0; i < xMarcaVehiculo.size(); i++) {
                cboMarca.addItem(xMarcaVehiculo.get(i).getDescripcion());
            }
            cboMarca.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadModelo() throws Exception {
        try {
            if (xModeloVehiculo == null) {
                xModeloVehiculo = new ArrayList<BeanModeloVehiculo>();
            } else {
                xModeloVehiculo.clear();
            }
            RnModeloVehiculo logic = new RnModeloVehiculo(path);
            xModeloVehiculo.addAll(logic.listarModeloVehiculo("", "A"));
            cboModelo.removeAllItems();
            cboModelo.addItem("-- SELECCIONE --");
            for (int i = 0; i < xModeloVehiculo.size(); i++) {
                cboModelo.addItem(xModeloVehiculo.get(i).getDescripcion());
            }
            cboModelo.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    private void agregarVehiculo() {
        if (txtConstacia.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Ingrese Constancia");
            txtConstacia.requestFocus();
            return;
        }
        if (txtPlaca.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Ingrese Placa");
            txtPlaca.requestFocus();
            return;
        }
        if (txtPeso.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Ingrese Peso");
            txtPeso.requestFocus();
            return;
        }
        if (cboMarca.getSelectedIndex() <= 0) {
            JOptionPane.showMessageDialog(this, "Seleccione Marca");
            cboMarca.requestFocus();
            return;
        }
        if (cboModelo.getSelectedIndex() <= 0) {
            JOptionPane.showMessageDialog(this, "Seleccione Modelo");
            cboModelo.requestFocus();
            return;
        }
        BeanVehiculo beanVehiculo = new BeanVehiculo();
        beanVehiculo.setId_vehiculo("");
        beanVehiculo.setOperacion("I");
        beanVehiculo.setPlaca(txtPlaca.getText().trim());
        beanVehiculo.setConstanciainscripcion(txtConstacia.getText().trim());
        beanVehiculo.setPeso(new BigDecimal(txtPeso.getText()));
        beanVehiculo.setEstado("A");
        beanVehiculo.setBeanMarcaVehiculo(xMarcaVehiculo.get(cboMarca.getSelectedIndex() - 1));
        beanVehiculo.setBeanModeloVehiculo(xModeloVehiculo.get(cboModelo.getSelectedIndex() - 1));
        modeltableVehiculo.agregarVehiculo(beanVehiculo);
        tableVehiculo.setAllColumnPreferredWidth();
        txtPeso.setText("0");
        txtPlaca.setText("");
        txtConstacia.setText("");
        cboMarca.setSelectedIndex(0);
        cboModelo.setSelectedIndex(0);
    }

    private void quitarVehiculo() {
        if (tableVehiculo.getSelectedRow() >= 0) {
            int xres = JOptionPane.showConfirmDialog(this, "Desea Quitar el Vehiculo?", "Quitar Vehiculo", JOptionPane.OK_CANCEL_OPTION);
            if (xres == JOptionPane.OK_OPTION) {
                BeanVehiculo beanVehiculo = modeltableVehiculo.getVehiculo(tableVehiculo.convertRowIndexToModel(tableVehiculo.getSelectedRow()));
                modeltableVehiculo.eliminarVehiculo(tableVehiculo.convertRowIndexToModel(tableVehiculo.getSelectedRow()));
                tableVehiculo.setAllColumnPreferredWidth();
                if (beanVehiculo.getId_vehiculo().trim().length() > 0) {
                    quitarVehiculo(beanVehiculo.getId_vehiculo().trim());
                }
            }

        } else {
            JOptionPane.showMessageDialog(this, "Seleccione Vehiculo");
        }
    }

    private void quitarVehiculo(String id_vehiculo) {
        for (int i = 0; i < listVehiculo.size(); i++) {
            if (listVehiculo.get(i).getId_vehiculo().equals(id_vehiculo)) {
                listVehiculo.get(i).setOperacion("E");
                break;
            }
        }
    }

    private void cargarTipoDoc(String id_tipo_doc) {
        for (int i = 0; i < xTipoDocIden.size(); i++) {
            if (xTipoDocIden.get(i).getId_tipo_doc().equals(id_tipo_doc)) {
                cbo_TipoDocIden.setSelectedIndex(i + 1);
                break;
            }
        }
    }

    @Override
    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        if (cbo_TipoDocIden.getSelectedIndex() < 1) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Cliente, debes Seleccionar un Tipo de Documento.", "Datos incompletos de Transportista", JOptionPane.CANCEL_OPTION);
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
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Transportista, debes " + "especificar su Apellido Paterno.", "Datos incompletos del Transportista", JOptionPane.CANCEL_OPTION);
                txt_ApePaterno.setBorder(new LineBorder(Color.RED));
                txt_ApePaterno.requestFocus();
                return false;
            }
            txt_ApeMaterno.setBorder(txt.getBorder());
            if (txt_ApeMaterno.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Transportista, debes " + "especificar su Apellido Materno.", "Datos incompletos del Transportista", JOptionPane.CANCEL_OPTION);
                txt_ApeMaterno.setBorder(new LineBorder(Color.RED));
                txt_ApeMaterno.requestFocus();
                return false;
            }
            txt_Nombre.setBorder(txt.getBorder());
            if (txt_Nombre.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Transportista, debes " + "especificar su Nombre.", "Datos incompletos del Transportista", JOptionPane.CANCEL_OPTION);
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
                    JOptionPane.showMessageDialog(this, "Para " + namemode + " un Transportista, debes " + "especificar su Apellido Paterno.", "Datos incompletos del Transportista", JOptionPane.CANCEL_OPTION);
                    txt_ApePaterno.setBorder(new LineBorder(Color.RED));
                    txt_ApePaterno.requestFocus();
                    return false;
                }
                txt_ApeMaterno.setBorder(txt.getBorder());
                if (txt_ApeMaterno.getText().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, "Para " + namemode + " un Transportista, debes " + "especificar su Apellido Materno.", "Datos incompletos del Transportista", JOptionPane.CANCEL_OPTION);
                    txt_ApeMaterno.setBorder(new LineBorder(Color.RED));
                    txt_ApeMaterno.requestFocus();
                    return false;
                }
                txt_Nombre.setBorder(txt.getBorder());
                if (txt_Nombre.getText().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, "Para " + namemode + " un Transportista, debes " + "especificar su Nombre.", "Datos incompletos del Transportista", JOptionPane.CANCEL_OPTION);
                    txt_Nombre.setBorder(new LineBorder(Color.RED));
                    txt_Nombre.requestFocus();
                    return false;
                }
            }

        }
        txt_Descripcion.setBorder(txt.getBorder());
        if (txt_Descripcion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Transportista, debes " + "especificar su Descripcion.", "Datos incompletos del Transportista", JOptionPane.CANCEL_OPTION);
            txt_Descripcion.setBorder(new LineBorder(Color.RED));
            txt_Descripcion.requestFocus();
            return false;
        }

        if (cbo_Nacionalidad.getSelectedIndex() < 1) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Transportista, debes Seleccionar una Nacionalidad.", "Datos incompletos de Transportista", JOptionPane.CANCEL_OPTION);
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
        btnAgregar.setEnabled(flag);
        btnQuitar.setEnabled(flag);
    }

    @Override
    public void loadCombo() {
        try {
            loadMarca();
            loadModelo();
            loadTipoDocIden();
            loadNacionalidad();
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
        btn_Activar.setEnabled(false);
        btn_Desactivar.setEnabled(false);
        cbo_TipoDocIden.setSelectedItem("RUC");
    }

    @Override
    public boolean loadRegister() {
        try {
            Anexo beanAnexo = new Anexo();
            txt_Codigo.setText(rowSelection.getSelectedValue(1).toString());
            RnAnexo regla = new RnAnexo(path);
            List<Anexo> listAnexo = regla.listAnexo("", rowSelection.getSelectedValue(1).toString(), "", "", "");
            if (listAnexo.isEmpty()) {
                throw new Exception("No se Encontro datos");
            }
            beanAnexo = listAnexo.get(0);
            //cbo_TipoDocIden.setSelectedItem(beanAnexo.getTipodociden());
            cargarTipoDoc(beanAnexo.getIdTipoDoc());
            txt_NumDoc.setText(beanAnexo.getNumerodoc());
            txt_ApePaterno.setText(beanAnexo.getPaterno());
            txt_ApeMaterno.setText(beanAnexo.getMaterno());
            txt_Nombre.setText(beanAnexo.getNombres());
            txt_Descripcion.setText(beanAnexo.getDescripcion());
            txt_Direccion.setText(beanAnexo.getDireccion());
            rb_SexoMasculino.setSelected(beanAnexo.getSexo().equals("M"));
            rb_SexoFemenino.setSelected(beanAnexo.getSexo().equals("F"));
            txt_TelFijo.setText(beanAnexo.getTelefono());
            txt_TelMovil.setText(beanAnexo.getCelular());
            //cbo_Nacionalidad.setSelectedItem(beanAnexo.getNacionalidad());
            cbo_Nacionalidad.setSelectedItem("PERUANA");
            chkEstado.setSelected(beanAnexo.getEstadoanexo().equals("A"));
            chk_agpercepcion.setSelected(beanAnexo.getFlagpercepcion().equals("S"));
            chk_agretencion.setSelected(beanAnexo.getFlagretencion().equals("S"));
            chk_exeptuado.setSelected(beanAnexo.getFlagExceptuado().equals("S"));
            //Anexo Activacion
            List<AnexoActivacion> listActiva = regla.listarActivaciones(rowSelection.getSelectedValue(1).toString());
            modeltableAnexoActivacion.agregarVectorAnexoActivacion(listActiva);
            modeltableAnexoActivacion.fireTableDataChanged();
            tableAnexoActivacion.getColumnModel().getColumn(0).setCellRenderer(new CellRendererImageEstado());
            RnVehiculo logiVehiculo = new RnVehiculo(path);
            listVehiculo = logiVehiculo.listarVehiculo("", rowSelection.getSelectedValue(1).toString(), "A");
            modeltableVehiculo.agregarVectorVehiculo(listVehiculo);
            modeltableVehiculo.fireTableDataChanged();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Transportista", JOptionPane.OK_OPTION);
            return false;
        }
    }

    @Override
    public boolean loadRegister(Object o) {
        return false;
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
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
            Anexo beanAnexo = new Anexo();
            beanAnexo = llenarBeanAnexo();
            RnAnexo logicAnexo = new RnAnexo(path);
            return logicAnexo.mantTransportista(beanAnexo, getXmlVehiculo(), "I");
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Transportista", JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public String executeUpdate() {
        try {
            Anexo beanAnexo = new Anexo();
            beanAnexo = llenarBeanAnexo();
            RnAnexo logicAnexo = new RnAnexo(path);
            return logicAnexo.mantTransportista(beanAnexo, getXmlVehiculo(), "A");
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Transportista", JOptionPane.OK_OPTION);
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
        if (btn_Activar == e.getSource()) {
            //Verificar si Existe Activado
            if (modeltableAnexoActivacion.getAnexoActivacion(modeltableAnexoActivacion.getRowCount() - 1).getEstado().equals("A")) {
                JOptionPane.showMessageDialog(this, "Transportista ya Esta Activado");
                return;
            }
            if (!modeltableAnexoActivacion.getAnexoActivacion(modeltableAnexoActivacion.getRowCount() - 1).getOperacion().equals("")) {
                JOptionPane.showMessageDialog(this, "Transportista recien lo acaba de Desactivar");
                return;
            }
            FormAnexoActivacion frmAnexoActivacion = new FormAnexoActivacion(this, path, "A", "Transportista");//,btn_ActivarCliente
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
        if (btn_Desactivar == e.getSource()) {
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
                    JOptionPane.showMessageDialog(this, "Transportista recien lo acaba de Activar");
                    return;
                }
                FormAnexoActivacion frmAnexoActivacion = new FormAnexoActivacion(this, path, "D", "Transportista");
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
        if (e.getSource().equals(btnAgregar)) {
            agregarVehiculo();
        }
        if (e.getSource().equals(btnQuitar)) {
            quitarVehiculo();
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
