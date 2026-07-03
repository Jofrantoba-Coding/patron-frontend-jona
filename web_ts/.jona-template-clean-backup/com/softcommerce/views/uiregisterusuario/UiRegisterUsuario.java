package com.softcommerce.views.uiregisterusuario;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Trabajador;
import com.softcommerce.beans.Usuario;
import java.awt.Component;
import java.awt.event.FocusEvent;
import javax.swing.JPanel;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.KeyEvent;
import javax.swing.BorderFactory;
import java.awt.event.KeyListener;
import java.awt.Color;
import java.awt.Font;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import com.softcommerce.general.controles.CCheckBox;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.CPasswordField;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.EncryptDecrypt;
import com.softcommerce.general.controles.LimitDocument;
import com.softcommerce.iconos.Gif;
import com.softcommerce.general.controles.Register;
import java.awt.BorderLayout;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Frame;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.SwingConstants;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import com.softcommerce.reglasnegocio.RnTrabajador;
import com.softcommerce.reglasnegocio.RnUsuario;
import javax.swing.JCheckBox;

public class UiRegisterUsuario
        extends JHDialog
        implements InterUiRegisterUsuario, ActionListener, KeyListener {

    private static final long serialVersionUID = 1L;
    protected Gif gif;
    protected JTextField txt_Codigo;
    protected JTextField txtTrabajador;
    protected JTextField txt_TipoTrab;
    protected JTextField txt_Nombre;
    protected JTextField txt_CodigoTrabajador;
    protected JButton cbBuscarTrabajador;
    protected JButton cbNuevoTrabajador;
    protected JTextField txt_Clave;
    protected CPasswordField txtp_Clave;
    protected CCheckBox ck_Clave;
    protected JTextField txt_NuevaClave;
    protected CPasswordField txtp_NuevaClave;
    protected CCheckBox ck_NuevaClave;
    protected JTextField txt_NuevaClaveConfirmar;
    protected CPasswordField txtp_NuevaClaveConfirmar;
    protected CCheckBox ck_NuevaClaveConfirmar;
    protected CCheckBox ck_Modificar;
    protected CCheckBox ck_Eliminar;
    protected CCheckBox ck_Insertar;
    protected CCheckBox ck_Habilitado;
    protected JCheckBox chk_Web;
    protected JCheckBox chk_Escritorio;
    protected JCheckBox chk_Contable;
    protected CLabel lbl_NumCar;
    protected int mode = 0;
    protected PanelTFUsuario pnltf;
    protected Usuario usuario;
    protected JButton cbNew;
    protected JButton cbOk;
    protected JButton cbCancel;
    protected JButton cbPrevius;
    protected JButton cbNext;
    protected JButton cbPrint;
    protected String titleName;
    protected String titleAnular;
    protected String titleInsert;
    protected String titleUpdate;
    protected String titleDelete;
    protected String titleDetail;
    protected String namemode;

    public UiRegisterUsuario(Frame arg0, Usuario usuario, PanelTFUsuario pnltf) {
        super(arg0);

        this.pnltf = pnltf;
        this.usuario = usuario;
        inicialize();
    }

    public UiRegisterUsuario(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public JPanel configurarPanelOperaciones() {
        gif = new Gif();

        JPanel pnl_Dialog = new JPanel();
        pnl_Dialog.setLayout(null);
        pnl_Dialog.setBackground(new Color(245, 245, 245));

        Border border = BorderFactory.createTitledBorder(null, " Datos de Usuario ", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Verdana", 0, 13), Color.BLACK);

        JPanel pnl_Usuario = new JPanel();
        pnl_Usuario.setLayout(null);
        pnl_Usuario.setBorder(border);
        pnl_Usuario.setBackground(new Color(245, 245, 245));

        CLabel lbl_Codigo = new CLabel("Código");
        lbl_Codigo.setBounds(35, 45, 70, 20);
        pnl_Usuario.add(lbl_Codigo);

        txt_Codigo = new JTextField();
        txt_Codigo.setBounds(110, 45, 80, 20);
        txt_Codigo.setEditable(false);
        pnl_Usuario.add(txt_Codigo);

        CLabel lblTrabajador = new CLabel("Trabajador");
        lblTrabajador.setBounds(35, 80, 70, 20);
        pnl_Usuario.add(lblTrabajador);

        txtTrabajador = new JTextField();
        txtTrabajador.setBounds(110, 80, 250, 20);
        txtTrabajador.addKeyListener(this);
        txtTrabajador.setEditable(false);
        pnl_Usuario.add(txtTrabajador);

        cbBuscarTrabajador = new JButton(gif.SEARCH16);
        cbBuscarTrabajador.setBounds(365, 80, 40, 20);
        cbBuscarTrabajador.setToolTipText("Buscar contribuyente");
        cbBuscarTrabajador.setContentAreaFilled(true);
        cbBuscarTrabajador.setBorderPainted(true);
        cbBuscarTrabajador.setFocusable(true);
        cbBuscarTrabajador.setFocusPainted(false);
        cbBuscarTrabajador.addActionListener(this);
        cbBuscarTrabajador.addKeyListener(this);
        KeyStroke keystroke1 = KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false);
        ActionListener action1 = new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                cbNuevoTrabajador.requestFocus();
            }
        };
        cbBuscarTrabajador.registerKeyboardAction(action1, keystroke1, JComponent.WHEN_FOCUSED);
        pnl_Usuario.add(this.cbBuscarTrabajador);

        txt_CodigoTrabajador = new JTextField();
        txt_CodigoTrabajador.setBounds(0, 0, 0, 0);
        txt_CodigoTrabajador.setVisible(false);
        pnl_Usuario.add(txt_CodigoTrabajador);

        cbNuevoTrabajador = new JButton(gif.ADDORANGE);
        cbNuevoTrabajador.setBounds(407, 80, 40, 20);
        cbNuevoTrabajador.setToolTipText("Nuevo contribuyente");
        cbNuevoTrabajador.addActionListener(this);
        cbNuevoTrabajador.addKeyListener(this);
        cbNuevoTrabajador.setFocusPainted(false);
        KeyStroke keystroke2 = KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false);
        ActionListener action2 = new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                txt_Nombre.requestFocus();
            }
        };
        cbNuevoTrabajador.registerKeyboardAction(action2, keystroke2, JComponent.WHEN_FOCUSED);
        pnl_Usuario.add(this.cbNuevoTrabajador);

        CLabel lbl_TipoTrab = new CLabel("Cargo");
        lbl_TipoTrab.setBounds(35, 115, 250, 20);
        pnl_Usuario.add(lbl_TipoTrab);

        txt_TipoTrab = new JTextField();
        txt_TipoTrab.setBounds(110, 115, 250, 20);
        txt_TipoTrab.addKeyListener(this);
        txt_TipoTrab.setEditable(false);
        pnl_Usuario.add(txt_TipoTrab);

        CLabel lbl_Nombre = new CLabel("Nombre de Usuario");
        lbl_Nombre.setBounds(35, 150, 120, 20);
        pnl_Usuario.add(lbl_Nombre);

        txt_Nombre = new JTextField();
        txt_Nombre.setBounds(150, 150, 200, 20);
        txt_Nombre.addKeyListener(this);
        pnl_Usuario.add(txt_Nombre);

        CLabel lbl_Clave = new CLabel("Contraseña");
        lbl_Clave.setBounds(35, 185, 70, 20);
        pnl_Usuario.add(lbl_Clave);

        txtp_Clave = new CPasswordField(20);
        txtp_Clave.setDocument(new LimitDocument(20));
        txtp_Clave.setBounds(115, 185, 90, 20);
        txtp_Clave.addKeyListener(this);
        pnl_Usuario.add(txtp_Clave);

        txt_Clave = new JTextField(20);
        txt_Clave.setBounds(115, 185, 90, 20);
        txt_Clave.setDocument(new LimitDocument(20));
        txt_Clave.addKeyListener(this);
        txt_Clave.setVisible(false);
        pnl_Usuario.add(txt_Clave);

        //ck_Clave = new CCheckBox(" Encryption/Decryption");
        ck_Clave = new CCheckBox("Mostrar caracteres");
        ck_Clave.setBounds(210, 185, 140, 20);
        ck_Clave.addActionListener(this);
        ck_Clave.addKeyListener(this);
        pnl_Usuario.add(ck_Clave);

        CLabel lbl_NuevaClave = new CLabel("Contraseña Nueva");
        lbl_NuevaClave.setBounds(35, 265, 70, 20);
        lbl_NuevaClave.setVisible(false);
        pnl_Usuario.add(lbl_NuevaClave);

        txtp_NuevaClave = new CPasswordField(20);
        txtp_NuevaClave.setDocument(new LimitDocument(20));
        txtp_NuevaClave.setBounds(115, 265, 90, 20);
        txtp_NuevaClave.setVisible(false);
        pnl_Usuario.add(txtp_NuevaClave);

        txt_NuevaClave = new JTextField(20);
        txt_NuevaClave.setDocument(new LimitDocument(20));
        txt_NuevaClave.setVisible(false);
        txt_NuevaClave.setBounds(115, 265, 90, 20);
        pnl_Usuario.add(txt_NuevaClave);

        ck_NuevaClave = new CCheckBox(" Encryption/Decryption");
        ck_NuevaClave.addActionListener(this);
        ck_NuevaClave.setBounds(210, 265, 140, 20);
        ck_NuevaClave.setVisible(false);
        pnl_Usuario.add(ck_NuevaClave);

        CLabel lbl_NuevaClaveConfirmar = new CLabel("Confirmar Contraseña");
        lbl_NuevaClaveConfirmar.setBounds(35, 230, 70, 20);
        lbl_NuevaClaveConfirmar.setVisible(false);
        pnl_Usuario.add(lbl_NuevaClaveConfirmar);

        txtp_NuevaClaveConfirmar = new CPasswordField(20);
        txtp_NuevaClaveConfirmar.setDocument(new LimitDocument(20));
        txtp_NuevaClaveConfirmar.setVisible(false);
        txtp_NuevaClaveConfirmar.setBounds(210, 230, 140, 20);
        pnl_Usuario.add(txtp_NuevaClaveConfirmar);

        txt_NuevaClaveConfirmar = new JTextField(20);
        txt_NuevaClaveConfirmar.setDocument(new LimitDocument(20));
        txt_NuevaClaveConfirmar.setBounds(115, 230, 90, 20);
        txt_NuevaClaveConfirmar.setVisible(false);
        pnl_Usuario.add(txt_NuevaClaveConfirmar);

        ck_NuevaClaveConfirmar = new CCheckBox(" Encryption/Decryption");
        ck_NuevaClaveConfirmar.addActionListener(this);
        ck_NuevaClaveConfirmar.setVisible(false);
        ck_NuevaClaveConfirmar.setBounds(115, 230, 90, 20);
        pnl_Usuario.add(ck_NuevaClaveConfirmar);

        lbl_NumCar = new CLabel(" (Numero máximo de caracteres : 20)");
        lbl_NumCar.setForeground(Color.red);
        pnl_Usuario.add(lbl_NumCar);

        CLabel lbl_Permisos = new CLabel("Permisos :");
        pnl_Usuario.add(lbl_Permisos);

        ck_Modificar = new CCheckBox(" Modificar");
        ck_Modificar.setMnemonic(KeyEvent.VK_M);
        ck_Modificar.addKeyListener(this);
        ck_Modificar.addActionListener(this);
        ck_Modificar.setVisible(false);
        pnl_Usuario.add(ck_Modificar);

        ck_Eliminar = new CCheckBox(" Eliminar");
        ck_Eliminar.setMnemonic(KeyEvent.VK_E);
        ck_Eliminar.addKeyListener(this);
        ck_Eliminar.addActionListener(this);
        ck_Eliminar.setVisible(false);
        pnl_Usuario.add(ck_Eliminar);

        ck_Insertar = new CCheckBox("Insertar");
        ck_Insertar.setMnemonic(KeyEvent.VK_I);
        ck_Insertar.addKeyListener(this);
        ck_Insertar.addActionListener(this);
        ck_Insertar.setVisible(false);
        pnl_Usuario.add(ck_Insertar);

        chk_Escritorio = new JCheckBox("Escritorio");
        chk_Web = new JCheckBox("Web");
        chk_Contable = new JCheckBox("Contable");
        pnl_Usuario.add(chk_Escritorio);
        pnl_Usuario.add(chk_Web);
        pnl_Usuario.add(chk_Contable);

        ck_Habilitado = new CCheckBox("Habilitado");
        ck_Habilitado.setMnemonic(KeyEvent.VK_I);
        ck_Habilitado.addKeyListener(this);
        ck_Habilitado.setHorizontalTextPosition(SwingConstants.LEFT);
        ck_Habilitado.addActionListener(this);
        pnl_Usuario.add(ck_Habilitado);

        if (mode != -1 && mode == 1) {
            ck_Modificar.setBounds(115, 322, 100, 20);
            ck_Eliminar.setBounds(215, 322, 100, 20);
            ck_Insertar.setBounds(315, 322, 100, 20);
            ck_Habilitado.setBounds(150, 357, 300, 20);
            lbl_NumCar.setBounds(115, 287, 220, 20);
            lbl_Permisos.setBounds(35, 322, 85, 20);
        } else {
            ck_Modificar.setBounds(115, 242, 100, 20);
            ck_Eliminar.setBounds(215, 242, 100, 20);
            ck_Insertar.setBounds(315, 242, 100, 20);
            chk_Escritorio.setBounds(115, 245, 100, 20);
            chk_Web.setBounds(215, 245, 100, 20);
            chk_Contable.setBounds(315, 245, 100, 20);
            ck_Habilitado.setBounds(150, 277, 300, 20);
            lbl_NumCar.setBounds(115, 207, 220, 20);
            lbl_Permisos.setBounds(35, 242, 85, 20);
        }

        pnl_Usuario.setBounds(20, 20, 460, 325);
        pnl_Dialog.add(pnl_Usuario);

        return pnl_Dialog;
    }

    protected JPanel configurarPanelControles() {
        JPanel pnlControles = new JPanel();
        pnlControles.setOpaque(true);
        pnlControles.setBackground(new Color(245, 245, 245));
        pnlControles.setLayout(new BorderLayout());
        pnlControles.setBorder(new EmptyBorder(10, 10, 10, 10));

        JPanel pnlLeft = new JPanel();
        pnlLeft.setLayout(new FlowLayout(FlowLayout.LEFT));
        pnlLeft.setBackground(new Color(245, 245, 245));

        cbNew = new JButton("Nuevo");
        cbNew.addActionListener(this);
        cbNew.addKeyListener(this);
        cbNew.setPreferredSize(new Dimension(90, 25));
        cbNew.setOpaque(false);
        pnlLeft.add(cbNew);

        pnlControles.add(pnlLeft, BorderLayout.WEST);

        JPanel pnlRight = new JPanel();
        pnlRight.setLayout(new FlowLayout(FlowLayout.RIGHT));
        pnlRight.setBackground(new Color(245, 245, 245));

        cbOk = new JButton("Aceptar");
        cbOk.addActionListener(this);
        cbOk.addKeyListener(this);
        cbOk.setPreferredSize(new Dimension(90, 25));
        cbOk.setOpaque(false);
        pnlRight.add(cbOk);

        cbCancel = new JButton("Cancelar");
        cbCancel.addActionListener(this);
        cbCancel.addKeyListener(this);
        cbCancel.setPreferredSize(new Dimension(90, 25));
        cbCancel.setOpaque(false);
        pnlRight.add(cbCancel);

        cbPrevius = new JButton(gif.UP);
        cbPrevius.addActionListener(this);
        cbPrevius.addKeyListener(this);
        cbPrevius.setPreferredSize(new Dimension(30, 25));
        cbPrevius.setOpaque(false);
        cbPrevius.setVisible(false);
        pnlRight.add(cbPrevius);

        cbNext = new JButton(gif.DOWN);
        cbNext.addActionListener(this);
        cbNext.addKeyListener(this);
        cbNext.setPreferredSize(new Dimension(30, 25));
        cbNext.setOpaque(false);
        cbNext.setVisible(false);
        pnlRight.add(cbNext);

        cbPrint = new JButton(gif.PRINT16);
        cbPrint.addActionListener(this);
        cbPrint.addKeyListener(this);
        cbPrint.setPreferredSize(new Dimension(30, 25));
        cbPrint.setOpaque(false);
        pnlRight.add(cbPrint);

        pnlControles.add(pnlRight, BorderLayout.EAST);

        return pnlControles;
    }

    protected void inicialize() {
        gif = new Gif();
        addWindowListener(new WindowAdapter() {
            @Override
            public void windowClosing(WindowEvent e) {
                dispose();
            }
        });

        JPanel pnlRegister = new JPanel();
        pnlRegister.setLayout(new BorderLayout());

        pnlRegister.add(configurarPanelControles(), BorderLayout.SOUTH);
        pnlRegister.add(configurarPanelOperaciones(), "Center");

        setContentPane(pnlRegister);
        setModal(true);
        setResizable(false);
        setSize(new Dimension(500, 435));
        ComponentToolKit.centerComponentPosicion(this);

        titleName = "Usuario";
        titleAnular = "Anular ";
        titleInsert = "Agregar ";
        titleUpdate = "Modificar ";
        titleDelete = "Eliminar ";
        titleDetail = "Detalle de ";
    }

    @Override
    public boolean setModeRegister(int m) {
        mode = m;

        switch (mode) {
            case INSERT:

                setMode(INSERT, true);
                setTitle(titleInsert + titleName);
                setRegisterEnabled(true);
                setRegisterEditable(true);
                loadCombo();
                newRegister();
                break;

            case DELETE:
                setMode(DELETE, true);
                setTitle(titleDelete + titleName);
                setRegisterEnabled(false);
                setRegisterEditable(false);
                loadCombo();
                if (!loadRegister()) {
                    return false;
                }
                break;

            case UPDATE:
                setMode(UPDATE, true);
                setTitle(titleUpdate + titleName);
                setRegisterEnabled(true);
                setRegisterEditable(true);
                loadCombo();
                if (!loadRegister()) {
                    return false;
                }

                break;

            case CLONE:

                setMode(INSERT, true);
                setTitle(titleInsert + titleName);
                setRegisterEnabled(true);
                setRegisterEditable(true);
                loadCombo();
                newRegister();
                if (!loadRegister()) {
                    return false;
                }
                break;

            case DETAIL:

                setMode(DETAIL, true);
                setTitle(titleDetail + titleName);
                setRegisterEnabled(false);
                setRegisterEditable(false);
                loadCombo();
                if (!loadRegister()) {
                    return false;
                }
                break;
        }

        return true;
    }

    public void setEnabledInsert(boolean e) {
        cbOk.setText("Guardar");
        cbNew.setEnabled(true);
        cbOk.setEnabled(e);
        cbPrevius.setVisible(false);
        cbNext.setVisible(false);
        cbPrint.setVisible(false);
    }

    public void setEnabledUpdate(boolean e) {
        cbOk.setText("Actualizar");
        cbNew.setEnabled(false);
        cbOk.setEnabled(e);
        cbPrevius.setVisible(false);
        cbNext.setVisible(false);
        cbPrint.setVisible(false);
    }

    public void setEnabledDelete(boolean e) {
        cbOk.setText("Eliminar");
        cbNew.setEnabled(false);
        cbOk.setEnabled(e);
        cbPrevius.setVisible(false);
        cbNext.setVisible(false);
        cbPrint.setVisible(false);
    }

    public void setEnabledAnular(boolean e) {
        cbOk.setText("Anular");
        cbNew.setEnabled(false);
        cbOk.setEnabled(e);
        cbPrevius.setVisible(false);
        cbNext.setVisible(false);
        cbPrint.setVisible(false);
    }

    public void setEnabledDetail(boolean e) {
        cbOk.setText("Aceptar");
        cbNew.setEnabled(false);
        cbOk.setEnabled(false);
        cbPrevius.setVisible(false);
        cbNext.setVisible(false);
        cbPrint.setVisible(false);
    }

    public void setMode(int mode, boolean e) {
        switch (mode) {
            case Register.ANULAR:
                setEnabledAnular(e);
                break;
            case Register.INSERT:
                setEnabledInsert(e);
                break;
            case Register.UPDATE:
                setEnabledUpdate(e);
                break;
            case Register.DELETE:
                setEnabledDelete(e);
                break;
            case Register.DETAIL:
                setEnabledDetail(e);
                break;
        }
    }

    @Override
    public void onClickOk() {
    }

    @Override
    public void insert() {
    }

    @Override
    public void delete() {
    }

    @Override
    public void update() {
    }

    @Override
    public void setRegisterEnabled(boolean e) {
        cbBuscarTrabajador.setEnabled(e);
        cbNuevoTrabajador.setEnabled(e);
        ck_Eliminar.setEnabled(e);
        ck_Habilitado.setEnabled(e);
        ck_Insertar.setEnabled(e);
        ck_Modificar.setEnabled(e);
        ck_Clave.setEnabled(e);
    }

    @Override
    public void setRegisterEditable(boolean e) {
        txt_Clave.setEditable(e);
        txt_Nombre.setEditable(e);
        txtp_Clave.setEditable(e);
    }

    @Override
    public String executeInsert() {
        return null;
    }

    protected String getClave() {
        if (ck_Clave.isSelected()) {
            return txt_Clave.getText().trim();
        }
        return txtp_Clave.getText().trim();
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
    public boolean isRegisterValid() {
        return false;
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }

        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txt_Nombre) {
                if (txt_Clave.isVisible()) {
                    txt_Clave.requestFocus();
                }

                if (txtp_Clave.isVisible()) {
                    txtp_Clave.requestFocus();
                }
            }

            if (e.getSource() == txt_Clave) {
                ck_Clave.requestFocus();
            }

            if (e.getSource() == txtp_Clave) {
                ck_Clave.requestFocus();
            }

            if (e.getSource() == ck_Clave) {
                ck_Modificar.requestFocus();
            }

            if (e.getSource() == ck_Modificar) {
                ck_Eliminar.requestFocus();
            }

            if (e.getSource() == ck_Eliminar) {
                ck_Insertar.requestFocus();
            }

            if (e.getSource() == ck_Insertar) {
                ck_Habilitado.requestFocus();
            }

            if (e.getSource() == ck_Habilitado) {
                cbOk.requestFocus();
            }
        }
    }

    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_Clave) {
            txt_Clave.selectAll();
        }

        if (e.getSource() == txt_Nombre) {
            txt_Nombre.selectAll();
        }

        if (e.getSource() == txtp_Clave) {
            txtp_Clave.selectAll();
        }
    }

    @Override
    public void newRegister() {
    }

    @Override
    public void setValueSearch(Object codigo, Component comp) {
    }

    public void cargarTrabajador(String codigo) {
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (cbNew == e.getSource()) {
            newRegister();
        }

        if (cbCancel == e.getSource()) {
            dispose();
        }

        if (cbOk == e.getSource()) {
            onClickOk();
        }

        if (cbNuevoTrabajador == e.getSource()) {
            RegisterTrabajador regTrabajador = new RegisterTrabajador(this, usuario);
            regTrabajador.setModeRegister(1);
            regTrabajador.setVisible(true);
        }

        if (cbBuscarTrabajador == e.getSource()) {
            BuscarTrabajador search = new BuscarTrabajador(this, path);
            search.cargarTabla(cbBuscarTrabajador);
        }

        if (ck_Clave == e.getSource()) {
            if (ck_Clave.isSelected()) {
                txt_Clave.setText("");
                txtp_Clave.setVisible(false);
                txt_Clave.setVisible(true);

                if (txtp_Clave.getText().trim().length() > 0) {
                    txt_Clave.setText(txtp_Clave.getText().trim());
                }
            } else {
                txtp_Clave.setText("");
                txt_Clave.setVisible(false);
                txtp_Clave.setVisible(true);

                if (txt_Clave.getText().trim().length() > 0) {
                    txtp_Clave.setText(txt_Clave.getText().trim());
                }
            }
        }
    }

    @Override
    public boolean loadRegister() {
        return false;
    }

    public void loadDialogPassword() {
    }

    public void prepareRegister() {
    }

    public void loadRegisterChangePassword() {
    }

    public void itemStateChanged(ItemEvent e) {
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    public boolean executeDetail() {
        return false;
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
    public void showMessageErrorInsert() {
    }

    @Override
    public void showMessageErrorUpdate() {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void showMessageErrorDelete() {
    }

    public boolean showConfirmDelete() {
        return false;
    }

    @Override
    public boolean executeSelect() {
        return false;
    }

    @Override
    public void loadCombo() {
    }

    @Override
    public void showMessagePrint(String codigo) {
    }

    public void updateRow(Object[] ob, Component comp, int modo) {
    }

    @Override
    public boolean executeAnular() {
        return false;
    }

    public void focusLost(FocusEvent e) {
    }

    @Override
    public boolean loadRegister(Object o) {
        return false;
    }
}
