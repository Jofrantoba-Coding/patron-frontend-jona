/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiregistertrabajador;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.AnexoActivacion;
import com.softcommerce.beans.BeanTipoTrabajador;
import com.softcommerce.beans.BeanTipoTrabajadorPerfil;
import com.softcommerce.beans.BeanTrabajador;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHDialog;
import static com.softcommerce.general.controles.Register.CLONE;
import static com.softcommerce.general.controles.Register.INSERT;
import static com.softcommerce.general.controles.Register.UPDATE;
import com.softcommerce.general.controles.UpperCaseDocument;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.tablas.AnexoActivacionTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnTipoTrabajador;
import com.softcommerce.reglasnegocio.RnTipoTrabajadorPerfil;
import com.softcommerce.reglasnegocio.RnTrabajador;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.util.render.CellRendererImageEstado;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dialog;
import java.awt.Dimension;
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
import javax.swing.JRadioButton;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTextField;
import javax.swing.JToolBar;
import javax.swing.SwingConstants;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;
import javax.swing.table.TableRowSorter;

/**
 *
 * @author Team Develtrex
 */
public class UiRegisterTrabajador
        extends JHDialog
        implements InterUiRegisterTrabajador, ActionListener, ItemListener, KeyListener, WindowListener, MouseListener, FocusListener, TableModelListener, ListSelectionListener {

    protected Usuario usuario;
    protected Gif gif;
    protected JTabbedPane tabb;
    protected JTextField txtCodigo;
    protected JCheckBox chkEstado;
    protected JComboBox cboTipoTrabajador;
    protected JComboBox cboTipoTrabajadorPerfil;
    protected JTextField txtApPaterno;
    protected JTextField txtApMaterno;
    protected JTextField txtNombre;
    protected JTextField txtDireccion;
    protected JTextField txtEmail;
    protected ButtonGroup bgSexo;
    protected JRadioButton rbMasculino;
    protected JRadioButton rbFemenino;
    protected JDateChooser dcFecha;
    protected JTextField txtDni;
    protected JTextField txtTelef;
    protected JTextField txtCelular;
    //Activacion de Cliente
    protected JButton btn_Activar;
    protected JButton btn_Desactivar;
    protected CTable tableAnexoActivacion;
    protected AnexoActivacionTableModel modeltableAnexoActivacion;
    protected TableRowSorter modeloOrdenadoAnexoActivacion;
    protected JScrollPane scrollAnexoActivacion;
    protected List<BeanTipoTrabajador> xtipotrabajador;
    protected List<BeanTipoTrabajadorPerfil> xTipoTrabajadorPerfil;
    protected String id_anexo = "";

    public UiRegisterTrabajador(Frame arg0, Usuario usuario) {
        super(arg0, true);
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    public UiRegisterTrabajador(Dialog arg0, Usuario usuario) {
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
        tabb.addTab("Activación de Trabajador", getPanelActivacion());

        pnl_dialog.add(tabb, BorderLayout.CENTER);

        //tabb.setBounds(10, 10, 815, 430);
        pnl_dialog.add(tabb);

        setTitleName("Trabajador");
        setRegister(pnl_dialog);
        setSize(new Dimension(500, 450));
        ComponentToolKit.centerComponentPosicion(this);
    }

    protected void initListener() {
        cboTipoTrabajador.addActionListener(this);
        txtApPaterno.addFocusListener(this);
        txtApMaterno.addFocusListener(this);
        txtNombre.addFocusListener(this);
        txtDireccion.addFocusListener(this);
        txtEmail.addFocusListener(this);
        txtDni.addFocusListener(this);
        txtTelef.addFocusListener(this);
        txtCelular.addFocusListener(this);
    }

    protected JPanel getPanelDatosGeneral() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnlPrinc.add(pnl, BorderLayout.NORTH);
        JPanel pnlGeneral = new JPanel();
        pnlGeneral.setLayout(new GridBagLayout());
        //pnlGeneral.setBackground(new Color(245, 245, 245));
        GridBagConstraints gbc = new GridBagConstraints();
        pnl.add(pnlGeneral, BorderLayout.WEST);
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;
        JLabel lblCodigo = new JLabel("Código");
        pnlGeneral.add(lblCodigo, gbc);

        txtCodigo = new JTextField();
        txtCodigo.setEnabled(false);
        txtCodigo.setColumns(6);
        gbc.gridx = 1;
        pnlGeneral.add(txtCodigo, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblTipoTrabajador = new JLabel("Tipo Trabajador");
        pnlGeneral.add(lblTipoTrabajador, gbc);

        gbc.gridx = 1;
        cboTipoTrabajador = new JComboBox();
        gbc.gridwidth = 3;
        pnlGeneral.add(cboTipoTrabajador, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblTrabajadorPerfil = new JLabel("Trabajador Perfil");
        pnlGeneral.add(lblTrabajadorPerfil, gbc);
        gbc.gridx = 1;
        gbc.gridwidth = 3;
        cboTipoTrabajadorPerfil = new JComboBox();
        pnlGeneral.add(cboTipoTrabajadorPerfil, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 3;
        JLabel lblApPaterno = new JLabel("Ap Paterno");
        pnlGeneral.add(lblApPaterno, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 3;
        txtApPaterno = new JTextField();
        txtApPaterno.setColumns(25);
        txtApPaterno.setDocument(new UpperCaseDocument(50));
        pnlGeneral.add(txtApPaterno, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 4;
        JLabel lblApMaterno = new JLabel("Ap Materno");
        pnlGeneral.add(lblApMaterno, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 3;
        txtApMaterno = new JTextField();
        txtApMaterno.setColumns(25);
        txtApMaterno.setDocument(new UpperCaseDocument(50));
        pnlGeneral.add(txtApMaterno, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 5;
        JLabel lblNombre = new JLabel("Nombres");
        pnlGeneral.add(lblNombre, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 3;
        txtNombre = new JTextField();
        txtNombre.setColumns(25);
        txtNombre.setDocument(new UpperCaseDocument(50));
        pnlGeneral.add(txtNombre, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 6;
        JLabel lblDireccion = new JLabel("Direccion");
        pnlGeneral.add(lblDireccion, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 3;
        txtDireccion = new JTextField();
        txtDireccion.setColumns(25);
        //txtDireccion.setDocument(new UpperCaseDocument(300));
        pnlGeneral.add(txtDireccion, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 7;
        JLabel lblEmail = new JLabel("Email");
        pnlGeneral.add(lblEmail, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 3;
        txtEmail = new JTextField();
        txtEmail.setColumns(25);
        //txtEmail.setDocument(new UpperCaseDocument(50));
        pnlGeneral.add(txtEmail, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 8;
        JLabel lblSexo = new JLabel("Sexo");
        pnlGeneral.add(lblSexo, gbc);
        gbc.gridx = 1;

        bgSexo = new ButtonGroup();
        rbMasculino = new JRadioButton("Masculino");
        rbMasculino.setSelected(true);
        rbFemenino = new JRadioButton("Femenino");
        bgSexo.add(rbMasculino);
        bgSexo.add(rbFemenino);
        pnlGeneral.add(rbMasculino, gbc);
        gbc.gridx = 2;
        gbc.gridwidth = 2;
        pnlGeneral.add(rbFemenino, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 9;
        JLabel lblFecha = new JLabel("Fecha Nac");
        pnlGeneral.add(lblFecha, gbc);
        gbc.gridx = 1;
        dcFecha = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dcFecha.setDate(Main.fechaActualServer);
        pnlGeneral.add(dcFecha, gbc);
        gbc.gridx = 2;
        JLabel lblDni = new JLabel("Dni");
        pnlGeneral.add(lblDni, gbc);
        gbc.gridx = 3;
        txtDni = new JTextField();
        txtDni.setColumns(10);
        txtDni.setDocument(new IntegerDocument(10));
        pnlGeneral.add(txtDni, gbc);

        gbc.gridx = 0;
        gbc.gridy = 10;
        JLabel lblFijo = new JLabel("Telf Fijo");
        pnlGeneral.add(lblFijo, gbc);
        gbc.gridx = 1;
        txtTelef = new JTextField();
        txtTelef.setColumns(10);
        txtTelef.setDocument(new IntegerDocument(10));
        pnlGeneral.add(txtTelef, gbc);
        gbc.gridx = 2;
        JLabel lblCelular = new JLabel("Telf Movil");
        pnlGeneral.add(lblCelular, gbc);
        gbc.gridx = 3;
        txtCelular = new JTextField();
        txtCelular.setColumns(10);
        txtCelular.setDocument(new IntegerDocument(10));
        pnlGeneral.add(txtCelular, gbc);

        chkEstado = new JCheckBox("Estado");
        chkEstado.setVisible(false);
        chkEstado.setEnabled(false);

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
        scrollAnexoActivacion.setPreferredSize(new Dimension(1000, 380));

        pnlActivacion.add(scrollAnexoActivacion, BorderLayout.CENTER);

        return pnlActivacion;
    }

    protected BeanTrabajador getBeanTrabajador() {
        BeanTrabajador beanTrabajador = new BeanTrabajador();
        BeanTipoTrabajador beanTipoTrabajador = xtipotrabajador.get(cboTipoTrabajador.getSelectedIndex() - 1);
        BeanTipoTrabajadorPerfil beanTipoTrabajadorPerfil = xTipoTrabajadorPerfil.get(cboTipoTrabajadorPerfil.getSelectedIndex() - 1);
        beanTipoTrabajadorPerfil.setBeanTipoTrabajador(beanTipoTrabajador);
        beanTrabajador.setBeanTipoTrabajadorPerfil(beanTipoTrabajadorPerfil);
        beanTrabajador.setId_trabajador(txtCodigo.getText().trim());
        beanTrabajador.setNombre(txtApPaterno.getText().trim() + " " + txtApMaterno.getText().trim() + " "
                + txtNombre.getText().trim());
        beanTrabajador.setDireccion(txtDireccion.getText());
        beanTrabajador.setSexo(rbMasculino.isSelected() ? "M" : "F");
        beanTrabajador.setFecha_nac(dcFecha.getDate());
        beanTrabajador.setDni(txtDni.getText());
        beanTrabajador.setTelef(txtTelef.getText());
        beanTrabajador.setCelular(txtCelular.getText());
        beanTrabajador.setEmail(txtEmail.getText());
        beanTrabajador.setId_anexo(id_anexo);
        beanTrabajador.setPaterno(txtApPaterno.getText());
        beanTrabajador.setMaterno(txtApMaterno.getText());
        beanTrabajador.setNombreAnexo(txtNombre.getText());
        beanTrabajador.setEstado(chkEstado.isSelected() ? "A" : "D");
        beanTrabajador.setId_empresa(usuario.getCodempresa());
        beanTrabajador.setId_usuario(usuario.getId_usuario());

        return beanTrabajador;
    }

    protected String getXmlActivacion() {
        //Llenar XmlActivacion
        String xmlActivacion;
        SimpleDateFormat fe = new SimpleDateFormat("dd/MM/yyyy");
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
        return xmlActivacion;
    }

    protected void activacionDefecto() {
    }

    protected void loadTipoTrabajador() {
    }

    protected void loadPerfil(String id_tipo_tranbajador) {
    }

    protected void cargarTipoTrabajador(String id_tipo) {
    }

    protected void cargarTrabajadorPerfil(int id_tipo) {
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
        cboTipoTrabajador.setEnabled(flag);
        cboTipoTrabajadorPerfil.setEnabled(flag);
        txtApPaterno.setEditable(flag);
        txtApMaterno.setEditable(flag);
        txtNombre.setEditable(flag);
        txtDireccion.setEditable(flag);
        txtEmail.setEditable(flag);
        txtDni.setEditable(flag);
        txtTelef.setEditable(flag);
        txtCelular.setEditable(flag);
        dcFecha.setEnabled(flag);
        rbFemenino.setEnabled(flag);
        rbMasculino.setEnabled(flag);
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
        if (cboTipoTrabajador == e.getSource()) {
            if (cboTipoTrabajador.getItemCount() > 0) {
                if (cboTipoTrabajador.getSelectedIndex() == 0) {
                    cboTipoTrabajadorPerfil.removeAllItems();
                    cboTipoTrabajadorPerfil.setEnabled(false);
                } else {
                    if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                        cboTipoTrabajadorPerfil.setEnabled(true);
                    }
                    loadPerfil(xtipotrabajador.get(cboTipoTrabajador.getSelectedIndex() - 1).getId_tipo_trabajador());

                }
            }
        }
        if (btn_Activar == e.getSource()) {
            //Verificar si Existe Activado
            if (modeltableAnexoActivacion.getRowCount() > 0) {
                if (modeltableAnexoActivacion.getAnexoActivacion(modeltableAnexoActivacion.getRowCount() - 1).getEstado().equals("A")) {
                    JOptionPane.showMessageDialog(this, "Trabajador ya Esta Activado");
                    return;
                }
                if (!modeltableAnexoActivacion.getAnexoActivacion(modeltableAnexoActivacion.getRowCount() - 1).getOperacion().equals("")) {
                    JOptionPane.showMessageDialog(this, "Trabajador recien lo acaba de Desactivar");
                    return;
                }
            }
            FormAnexoActivacion frmAnexoActivacion = new FormAnexoActivacion(this, path, "A", "Trabajador");//,btn_ActivarCliente
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
                    JOptionPane.showMessageDialog(this, "Trabajador recien lo acaba de Activar");
                    return;
                }
                FormAnexoActivacion frmAnexoActivacion = new FormAnexoActivacion(this, path, "D", "Trabajador");
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
        if (e.getSource() instanceof JTextField) {
            ((JTextField) e.getSource()).selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
    }

    @Override
    public void tableChanged(TableModelEvent e) {
    }

    @Override
    public void valueChanged(ListSelectionEvent e) {
    }
}
