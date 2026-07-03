package com.softcommerce.formularios;

import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.AnexoActivacion;
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
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnAnexo;
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
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
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
import javax.swing.table.TableRowSorter;
import org.apache.log4j.Logger;

public class RegisterChofer
        extends JHDialog
        implements ActionListener, KeyListener {

    private final Usuario usuario;
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
    private JTextField txtLicencia;
    private JComboBox cbo_Nacionalidad;
    private List<Nacionalidad> xNacionalidad;
    private JCheckBox chk_agpercepcion;
    private JCheckBox chk_agretencion;
    private JCheckBox chk_exeptuado;
    private JCheckBox chkEstado;
    //Activacion de Cliente
    private JButton btn_ActivarChofer;
    private JButton btn_DesactivarChofer;
    private CTable tableAnexoActivacion;
    private AnexoActivacionTableModel modeltableAnexoActivacion;
    private TableRowSorter modeloOrdenadoAnexoActivacion;
    private JScrollPane scrollAnexoActivacion;
    private final Logger logger = Logger.getLogger(RegisterChofer.class);

    public RegisterChofer(Frame arg0, Usuario usuario) {
        super(arg0, true);
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    public RegisterChofer(Dialog arg0, Usuario usuario) {
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

        tabb.addTab("General", getPanelDatosGeneral());
        tabb.addTab("Activación de Chofer", getPanelActivacion());

        pnl_dialog.add(tabb);

        tabb.setBounds(10, 10, 815, 430);
        pnl_dialog.add(tabb);

        setTitleName("Chofer");
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
        txt_Nombre.setDocument(new UpperCaseDocument(50));
        txt_Nombre.addKeyListener(this);
        gbc.gridx = 1;
        gbc.gridy = 3;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(txt_Nombre, gbc);

        JLabel lblLicencia = new JLabel("N° Licencia");
        gbc.gridx = 2;
        pnlGeneral.add(lblLicencia, gbc);

        txtLicencia = new JTextField();
        gbc.gridx = 3;
        txtLicencia.setDocument(new UpperCaseNumberDocument(20));
        pnlGeneral.add(txtLicencia, gbc);

        lbl_Descripcion = new JLabel("Razón Social");
        gbc.gridx = 0;
        gbc.gridy = 4;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_Descripcion, gbc);
        txt_Descripcion = new JTextField();
        txt_Descripcion.addKeyListener(this);
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
        txt_TelFijo.setDocument(new IntegerDocument(15));
        txt_TelFijo.addKeyListener(this);
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
        gbc.gridy = 8;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(cbo_Nacionalidad, gbc);

        chkEstado = new JCheckBox("Estado");
        chkEstado.setVisible(false);
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
        chk_agpercepcion.setVisible(false);
        chk_agpercepcion.setHorizontalTextPosition(SwingConstants.LEFT);
        chk_agpercepcion.setOpaque(false);
        chk_agpercepcion.setEnabled(false);
        panelPatrones.add(chk_agpercepcion);
        chk_agretencion = new JCheckBox("A Retencion");
        chk_agretencion.addKeyListener(this);
        chk_agretencion.setHorizontalTextPosition(SwingConstants.LEFT);
        chk_agretencion.setOpaque(false);
        chk_agretencion.setEnabled(false);
        chk_agretencion.setVisible(false);
        panelPatrones.add(chk_agretencion);

        chk_exeptuado = new JCheckBox("Exceptuado");
        chk_exeptuado.addKeyListener(this);
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

        return pnlGeneral;
    }

    private JPanel getPanelActivacion() {
        JPanel pnlActivacion = new JPanel(new BorderLayout());
        pnlActivacion.setLayout(new BorderLayout(0, 0));
        pnlActivacion.setBackground(new Color(245, 245, 245));
        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setPreferredSize(new Dimension(0, 30));

        btn_ActivarChofer = new JButton("Activar", gif.ADD16);
        btn_ActivarChofer.setMnemonic('A');
        btn_ActivarChofer.setHorizontalAlignment(SwingConstants.LEFT);
        btn_ActivarChofer.setIconTextGap(10);
        btn_ActivarChofer.addActionListener(this);
        btn_ActivarChofer.setOpaque(false);
        btn_ActivarChofer.addKeyListener(this);
        btn_ActivarChofer.setFocusPainted(false);
        btn_ActivarChofer.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btn_ActivarChofer);

        toolbar.addSeparator();

        btn_DesactivarChofer = new JButton("Desactivar", gif.ELIMINATE16);
        btn_DesactivarChofer.setMnemonic('D');
        btn_DesactivarChofer.setHorizontalAlignment(SwingConstants.LEFT);
        btn_DesactivarChofer.setIconTextGap(10);
        btn_DesactivarChofer.addActionListener(this);
        btn_DesactivarChofer.setOpaque(false);
        btn_DesactivarChofer.addKeyListener(this);
        btn_DesactivarChofer.setFocusPainted(false);
        btn_DesactivarChofer.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btn_DesactivarChofer);

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
                xNacionalidad = new ArrayList();
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
        //char val = txt_NumDoc.getText().charAt(0);
        //flag_tipo_persona = (xTipoDocIden.get(cbo_TipoDocIden.getSelectedIndex() - 1).getCodigo().equals("05") && val == '2') ? "J" : "N";
        beanAnexo.setFlagTipoPersona(flag_tipo_persona);
        beanAnexo.setPaterno(txt_ApePaterno.getText().trim());
        beanAnexo.setMaterno(txt_ApeMaterno.getText().trim());
        beanAnexo.setNombres(txt_Nombre.getText().trim());
        beanAnexo.setNrolicencia(txtLicencia.getText().trim());
        beanAnexo.setDescripcion(txt_Descripcion.getText().trim());
        //TipoDocIden beanTDV = new TipoDocIden();
        beanAnexo.setIdTipoDoc(cbo_TipoDocIden.getSelectedIndex() > 0 ? xTipoDocIden.get(cbo_TipoDocIden.getSelectedIndex() - 1).getId_tipo_doc() : "");
        beanAnexo.setNumerodoc(txt_NumDoc.getText().trim());
        beanAnexo.setNrolicencia(txtLicencia.getText().trim());
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
        String xmlActivacion;
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
        logger.info("xml_activacion: " + xmlActivacion);
        beanAnexo.setXmlActivacion(xmlActivacion);

        return beanAnexo;
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

    @Override
    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        if (cbo_TipoDocIden.getSelectedIndex() < 1) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Chofer, debes Seleccionar un Tipo de Documento.", "Datos incompletos de Chofer", JOptionPane.CANCEL_OPTION);
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
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Chofer, debes " + "especificar su Apellido Paterno.", "Datos incompletos del Chofer", JOptionPane.CANCEL_OPTION);
                txt_ApePaterno.setBorder(new LineBorder(Color.RED));
                txt_ApePaterno.requestFocus();
                return false;
            }
            txt_ApeMaterno.setBorder(txt.getBorder());
            if (txt_ApeMaterno.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Chofer, debes " + "especificar su Apellido Materno.", "Datos incompletos del Chofer", JOptionPane.CANCEL_OPTION);
                txt_ApeMaterno.setBorder(new LineBorder(Color.RED));
                txt_ApeMaterno.requestFocus();
                return false;
            }
            txt_Nombre.setBorder(txt.getBorder());
            if (txt_Nombre.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Chofer, debes " + "especificar su Nombre.", "Datos incompletos del Chofer", JOptionPane.CANCEL_OPTION);
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
                    JOptionPane.showMessageDialog(this, "Para " + namemode + " un Chofer, debes " + "especificar su Apellido Paterno.", "Datos incompletos del Chofer", JOptionPane.CANCEL_OPTION);
                    txt_ApePaterno.setBorder(new LineBorder(Color.RED));
                    txt_ApePaterno.requestFocus();
                    return false;
                }
                txt_ApeMaterno.setBorder(txt.getBorder());
                if (txt_ApeMaterno.getText().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, "Para " + namemode + " un Chofer, debes " + "especificar su Apellido Materno.", "Datos incompletos del Chofer", JOptionPane.CANCEL_OPTION);
                    txt_ApeMaterno.setBorder(new LineBorder(Color.RED));
                    txt_ApeMaterno.requestFocus();
                    return false;
                }
                txt_Nombre.setBorder(txt.getBorder());
                if (txt_Nombre.getText().trim().length() == 0) {
                    JOptionPane.showMessageDialog(this, "Para " + namemode + " un Chofer, debes " + "especificar su Nombre.", "Datos incompletos del Chofer", JOptionPane.CANCEL_OPTION);
                    txt_Nombre.setBorder(new LineBorder(Color.RED));
                    txt_Nombre.requestFocus();
                    return false;
                }
            }

        }
        txt_Descripcion.setBorder(txt.getBorder());
        if (txt_Descripcion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Chofer, debes " + "especificar su Descripcion.", "Datos incompletos del Chofer", JOptionPane.CANCEL_OPTION);
            txt_Descripcion.setBorder(new LineBorder(Color.RED));
            txt_Descripcion.requestFocus();
            return false;
        }

        if (cbo_Nacionalidad.getSelectedIndex() < 1) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Chofer, debes Seleccionar una Nacionalidad.", "Datos incompletos de Chofer", JOptionPane.CANCEL_OPTION);
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
        //cbo_TipoDocIden.setEnabled(flag);
        txt_NumDoc.setEditable(flag);
        txtLicencia.setEditable(flag);
        txt_ApePaterno.setEditable(flag);
        txt_ApeMaterno.setEditable(flag);
        txt_Nombre.setEditable(flag);
        txt_Descripcion.setEditable(flag);
        txt_Direccion.setEditable(flag);
        txt_TelFijo.setEditable(flag);
        txt_TelMovil.setEditable(flag);
        cbo_Nacionalidad.setEnabled(flag);
    }

    @Override
    public void loadCombo() {
        try {
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
        btn_ActivarChofer.setEnabled(false);
        btn_DesactivarChofer.setEnabled(false);
        cbo_TipoDocIden.setSelectedItem("DNI");
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
            cbo_TipoDocIden.setSelectedItem("DNI");
            txt_NumDoc.setText(beanAnexo.getNumerodoc());
            txtLicencia.setText(beanAnexo.getNrolicencia());
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
            return true;
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Chofer", JOptionPane.OK_OPTION);
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
            String rpta = "";
            RnAnexo logicAnexo = new RnAnexo(path);
            rpta = logicAnexo.mantChofer(beanAnexo, "I");
            return rpta;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Chofer", JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public String executeUpdate() {
        try {
            Anexo beanAnexo = new Anexo();
            beanAnexo = llenarBeanAnexo();
            String rpta = "";
            RnAnexo logic = new RnAnexo(path);
            rpta = logic.mantChofer(beanAnexo, "A");
            return rpta;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Chofer", JOptionPane.OK_OPTION);
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
        if (btn_ActivarChofer == e.getSource()) {
            //Verificar si Existe Activado
            if (modeltableAnexoActivacion.getAnexoActivacion(modeltableAnexoActivacion.getRowCount() - 1).getEstado().equals("A")) {
                JOptionPane.showMessageDialog(this, "Chofer ya Esta Activado");
                return;
            }
            if (!modeltableAnexoActivacion.getAnexoActivacion(modeltableAnexoActivacion.getRowCount() - 1).getOperacion().equals("")) {
                JOptionPane.showMessageDialog(this, "Chofer recien lo acaba de Desactivar");
                return;
            }
            FormAnexoActivacion frmAnexoActivacion = new FormAnexoActivacion(this, path, "A", "Chofer");//,btn_ActivarCliente
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
        if (btn_DesactivarChofer == e.getSource()) {
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
                    JOptionPane.showMessageDialog(this, "Chofer recien lo acaba de Activar");
                    return;
                }
                FormAnexoActivacion frmAnexoActivacion = new FormAnexoActivacion(this, path, "D", "Chofer");
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
    
}
