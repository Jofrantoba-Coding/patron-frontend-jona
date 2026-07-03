/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiregisterbancoanexo;


import com.softcommerce.formularios.*;
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

public class UiRegisterBancoAnexo
        extends JHDialog
        implements InterUiRegisterBancoAnexo, ActionListener, ItemListener, KeyListener, WindowListener, MouseListener, FocusListener, TableModelListener, ListSelectionListener {

    protected Usuario usuario;
    protected Gif gif;
    protected JTabbedPane tabb;
    protected JTextField txt_Codigo;
    protected JComboBox cbo_TipoDocIden;
    protected List<BeanTipoDocIden> xTipoDocIden;
    protected JTextField txt_NumDoc;
    protected JTextField txt_ApePaterno;
    protected JTextField txt_ApeMaterno;
    protected JTextField txt_Nombre;
    protected JTextField txt_Descripcion;
    protected JLabel lbl_Descripcion;
    protected JTextField txt_Direccion;
    protected JLabel lbl_Sexo;
    protected JPanel panelSexo;
    protected CRadioButton rb_SexoMasculino;
    protected CRadioButton rb_SexoFemenino;
    protected ButtonGroup bg_Sexo;
    protected JTextField txt_TelFijo;
    protected JTextField txt_TelMovil;
    protected JComboBox cbo_Nacionalidad;
    protected List<Nacionalidad> xNacionalidad;
    protected JTextField txt_Email;
    protected JCheckBox chk_agpercepcion;
    protected JCheckBox chk_agretencion;
    protected JCheckBox chk_exeptuado;
    protected JCheckBox chkEstado;
    //Activacion de Cliente
    protected JButton btn_Activar;
    protected JButton btn_Desactivar;
    protected CTable tableAnexoActivacion;
    protected AnexoActivacionTableModel modeltableAnexoActivacion;
    protected TableRowSorter modeloOrdenadoAnexoActivacion;
    protected JScrollPane scrollAnexoActivacion;
    protected final Logger logger = Logger.getLogger(UiRegisterBancoAnexo.class);

    public UiRegisterBancoAnexo(Frame arg0, Usuario usuario) {
        super(arg0, true);
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    public UiRegisterBancoAnexo(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    protected void inicialize() {
        addWindowListener(this);
        gif = new Gif();

        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(new BorderLayout());
        pnl_dialog.setBackground(new Color(245, 245, 245));

        tabb = new JTabbedPane();
        tabb.addKeyListener(this);
        tabb.addFocusListener(this);

        tabb.addTab("General", getPanelDatosGeneral());
        tabb.addTab("Activación de Banco", getPanelActivacion());

        pnl_dialog.add(tabb);

        //tabb.setBounds(10, 10, 815, 430);
        pnl_dialog.add(tabb, BorderLayout.CENTER);

        setTitleName("Banco");
        setRegister(pnl_dialog);
        setMinimumSize(new Dimension(860, 450));
        setMaximumSize(new Dimension(860, 450));
        this.pack();
        ComponentToolKit.centerComponentPosicion(this);
    }

    protected void initListener() {
    }

    protected JPanel getPanelDatosGeneral() {
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
        txt_TelFijo.setDocument(new IntegerDocument(15));
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

    protected JPanel getPanelActivacion() {
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

    protected void loadTipoDocIden() throws Exception {
    }

    protected void loadNacionalidad() throws Exception {
    }

    protected Anexo llenarBeanAnexo() {
        Anexo beanAnexo = new Anexo();
        SimpleDateFormat fe = new SimpleDateFormat("dd/MM/yyyy");
        beanAnexo.setIdAnexo(txt_Codigo.getText().trim());
        String flag_tipo_persona;
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
        System.out.println("xml_activacion: " + xmlActivacion);
        beanAnexo.setXmlActivacion(xmlActivacion);

        return beanAnexo;
    }

    protected void activacionDefecto() {
    }

    protected void cargarTipoDoc(String id_tipo_doc) {
    }

    @Override
    public boolean isRegisterValid() {
        return false;
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
    }

    @Override
    public void newRegister() {
    }

    @Override
    public boolean loadRegister() {
        return false;
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
        return null;
    }

    @Override
    public String executeUpdate() {
        return null;
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
                JOptionPane.showMessageDialog(this, "Banco ya Esta Activado");
                return;
            }
            if (!modeltableAnexoActivacion.getAnexoActivacion(modeltableAnexoActivacion.getRowCount() - 1).getOperacion().equals("")) {
                JOptionPane.showMessageDialog(this, "Banco recien lo acaba de Desactivar");
                return;
            }
            FormAnexoActivacion frmAnexoActivacion = new FormAnexoActivacion(this, path, "A", "Banco");//,btn_ActivarCliente
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
                    JOptionPane.showMessageDialog(this, "Banco recien lo acaba de Activar");
                    return;
                }
                FormAnexoActivacion frmAnexoActivacion = new FormAnexoActivacion(this, path, "D", "Banco");
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
