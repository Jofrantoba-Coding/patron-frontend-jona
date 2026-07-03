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
    private Gif gif;
    private JTextField txt_Codigo;
    private JTextField txtTrabajador;
    private JTextField txt_TipoTrab;
    private JTextField txt_Nombre;
    private JTextField txt_CodigoTrabajador;
    private JButton cbBuscarTrabajador;
    private JButton cbNuevoTrabajador;
    private JTextField txt_Clave;
    private CPasswordField txtp_Clave;
    private CCheckBox ck_Clave;
    private JTextField txt_NuevaClave;
    private CPasswordField txtp_NuevaClave;
    private CCheckBox ck_NuevaClave;
    private JTextField txt_NuevaClaveConfirmar;
    private CPasswordField txtp_NuevaClaveConfirmar;
    private CCheckBox ck_NuevaClaveConfirmar;
    private CCheckBox ck_Modificar;
    private CCheckBox ck_Eliminar;
    private CCheckBox ck_Insertar;
    private CCheckBox ck_Habilitado;
    private JCheckBox chk_Web;
    private JCheckBox chk_Escritorio;
    private JCheckBox chk_Contable;
    private CLabel lbl_NumCar;
    private int mode = 0;
    private PanelTFUsuario pnltf;
    private Usuario usuario;
    private JButton cbNew;
    private JButton cbOk;
    private JButton cbCancel;
    private JButton cbPrevius;
    private JButton cbNext;
    private JButton cbPrint;
    private String titleName;
    private String titleAnular;
    private String titleInsert;
    private String titleUpdate;
    private String titleDelete;
    private String titleDetail;
    private String namemode;

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

    private JPanel configurarPanelControles() {
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

    private void inicialize() {
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
        namemode = "";

        if ((mode == INSERT) || (mode == CLONE)) {
            namemode = "agregar";
        } else if (mode == UPDATE) {
            namemode = "modificar";
        } else if (mode == DELETE) {
            namemode = "eliminar";
        }

        switch (mode) {
            case INSERT:

                insert();
                break;

            case CLONE:

                insert();
                break;

            case UPDATE:

                update();
                break;

            case DELETE:

                delete();
                break;
        }
    }

    @Override
    public void insert() {
        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        if (isRegisterValid()) {
            int xResI = JOptionPane.showConfirmDialog(this, " ¿Realmente desea Registrar el Fichero " + titleName + "? ", titleName, JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE, null);

            if (xResI == JOptionPane.OK_OPTION) {
                String resultado = executeInsert();

                if (!resultado.equals("")) {
                    dispose();
                    if (pnltf != null) {
                        pnltf.controlRefresh();
                    }
                    setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
                } else {
                    setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
                }
            } else {
                setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
            }
        } else {
            setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
        }
    }

    @Override
    public void delete() {
        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        int xResD = JOptionPane.showConfirmDialog(this, " ¿Realmente desea Eliminar el Fichero " + titleName + "? ", titleName, JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE, null);
        if (xResD == JOptionPane.OK_OPTION) {
            if (executeDelete()) {
                setMode(DELETE, false);
                dispose();
                if (pnltf != null) {
                    int row;
                    if (pnltf.getSelectedRow() < pnltf.getRowCount() - 1) {
                        row = pnltf.getSelectedRow();
                    } else {
                        row = pnltf.getRowCount() - 2;
                    }

                    pnltf.controlRefresh();
                    pnltf.setSelectedRow(row);
                }

                setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
            } else {
                setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
            }
        } else {
            setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
        }
    }

    @Override
    public void update() {
        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        if (isRegisterValid()) {
            int xResU = JOptionPane.showConfirmDialog(this, " ¿Realmente desea Modificar el Fichero " + titleName + "? ", titleName, JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE, null);

            if (xResU == JOptionPane.OK_OPTION) {
                String resultado = executeUpdate();

                if (!resultado.equals("")) {
                    setRegisterEnabled(false);
                    setMode(UPDATE, false);

                    dispose();

                    if (pnltf != null) {
                        int row = pnltf.getSelectedRow();
                        pnltf.controlRefresh();
                        pnltf.setSelectedRow(row);
                    }

                    setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
                } else {
                    setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
                }
            } else {
                setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
            }
        } else {
            setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
        }
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
        try {
            RnUsuario regla = new RnUsuario(path);
            Usuario beanUsuario = new Usuario();
            beanUsuario.setId_trabajador(txt_CodigoTrabajador.getText().trim());
            beanUsuario.setNombre(txt_Nombre.getText().trim());
            beanUsuario.setClave(this.getClave());
            beanUsuario.setModificar(ck_Modificar.isSelected() ? "S" : "N");
            beanUsuario.setEliminar(ck_Eliminar.isSelected() ? "S" : "N");
            beanUsuario.setInsertar(ck_Insertar.isSelected() ? "S" : "N");
            beanUsuario.setFlaghabilitado(ck_Habilitado.isSelected() ? "H" : "D");
            beanUsuario.setFlagEscritorio(chk_Escritorio.isSelected() ? "S" : "N");
            beanUsuario.setFlagWeb(chk_Web.isSelected() ? "S" : "N");
            beanUsuario.setFlagContable(chk_Contable.isSelected() ? "S" : "N");
            return regla.mantUsuario(beanUsuario, usuario.getId_usuario(), "I");
            //return regla.insertar(txt_CodigoTrabajador.getText().trim(), txt_Nombre.getText().toString().trim(), txtp_Clave.getText().trim().length() > 0 ? txtp_Clave.getText().toString().trim() : txt_Clave.getText().trim().length() > 0 ? txt_Clave.getText().toString().trim() : " ", ck_Modificar.isSelected() ? "S" : "N", ck_Eliminar.isSelected() ? "S" : "N", ck_Insertar.isSelected() ? "S" : "N", ck_Habilitado.isSelected() ? "D" : "H", usuario.getId_usuario());
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    private String getClave() {
        if (ck_Clave.isSelected()) {
            return txt_Clave.getText().trim();
        }
        return txtp_Clave.getText().trim();
    }

    @Override
    public String executeUpdate() {
        try {
            RnUsuario regla = new RnUsuario(path);
            Usuario beanUsuario = new Usuario();
            beanUsuario.setId_usuario(txt_Codigo.getText().trim());
            beanUsuario.setId_trabajador(txt_CodigoTrabajador.getText().trim());
            beanUsuario.setNombre(txt_Nombre.getText().trim());
            beanUsuario.setClave(this.getClave());
            beanUsuario.setModificar(ck_Modificar.isSelected() ? "S" : "N");
            beanUsuario.setEliminar(ck_Eliminar.isSelected() ? "S" : "N");
            beanUsuario.setInsertar(ck_Insertar.isSelected() ? "S" : "N");
            beanUsuario.setFlaghabilitado(ck_Habilitado.isSelected() ? "H" : "D");
            beanUsuario.setFlagEscritorio(chk_Escritorio.isSelected() ? "S" : "N");
            beanUsuario.setFlagWeb(chk_Web.isSelected() ? "S" : "N");
            beanUsuario.setFlagContable(chk_Contable.isSelected() ? "S" : "N");
            return regla.mantUsuario(beanUsuario, usuario.getId_usuario(), "A");
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    @Override
    public boolean executeDelete() {
        RnUsuario regla = new RnUsuario(path);

        return regla.eliminar(txt_Codigo.getText().trim(), usuario.getId_usuario());
    }

    @Override
    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        txt_Nombre.setBorder(txt.getBorder());
        txtTrabajador.setBorder(txt.getBorder());
        txt_Clave.setBorder(txt.getBorder());
        txtp_Clave.setBorder(txt.getBorder());

        if (txtTrabajador.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un usuario, debes " + "especificar un Trajador.", "Datos incompletos del Usuario", 2);
            txtTrabajador.setBorder(new LineBorder(Color.RED));
            cbBuscarTrabajador.requestFocus();

            return false;
        }

        if (txt_Nombre.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un usuario, debes " + "especificar su nombre.", "Datos incompletos del Usuario", 2);
            txt_Nombre.setBorder(new LineBorder(Color.RED));
            txt_Nombre.requestFocus();

            return false;
        }

        if (txt_Clave.getText().trim().length() == 0
                && txtp_Clave.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un usuario, debes " + "especificar su clave.", "Datos incompletos del Usuario", 2);
            txt_Clave.setBorder(new LineBorder(Color.RED));
            txtp_Clave.setBorder(new LineBorder(Color.RED));
            if (txt_Clave.isVisible()) {
                txt_Clave.requestFocus();
            } else {
                txtp_Clave.requestFocus();
            }

            return false;
        }

        return true;
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
        JTextField txt = new JTextField();
        txt_Nombre.setBorder(txt.getBorder());
        txtTrabajador.setBorder(txt.getBorder());
        txt_Clave.setBorder(txt.getBorder());
        txtp_Clave.setBorder(txt.getBorder());
        lbl_NumCar.setForeground(Color.red);

        txt_Codigo.setText("");
        txt_Nombre.setText("");
        txt_CodigoTrabajador.setText("");
        txt_Clave.setText("");
        txt_TipoTrab.setText("");
        txtp_Clave.setText("");
        txt_Clave.setVisible(false);
        txtp_Clave.setVisible(true);
        txtTrabajador.setText("");
        ck_Clave.setSelected(false);
        ck_Eliminar.setSelected(false);
        ck_Modificar.setSelected(false);
        ck_Insertar.setSelected(false);
        ck_Habilitado.setSelected(false);

        cbBuscarTrabajador.requestFocus();
    }

    @Override
    public void setValueSearch(Object codigo, Component comp) {
        if (comp == cbBuscarTrabajador) {
            cargarTrabajador(codigo.toString());
        }
    }

    public void cargarTrabajador(String codigo) {
        try {
            RnTrabajador regla = new RnTrabajador(path);
            List<Trabajador> reg = regla.listarTrabajador(codigo);
            if (reg != null || reg.size() > 0) {
                txtTrabajador.setText(reg.get(0).getNombre());
                txt_CodigoTrabajador.setText(reg.get(0).getId_trabajador());
                txt_TipoTrab.setText(reg.get(0).getTipotrabajador());
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
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
        try {
            RnUsuario regla = new RnUsuario(path);
            List<Usuario> reg = regla.listar(rowSelection.getSelectedValue(1).toString(), "", "", "", "", "", "", "");

            if (reg.isEmpty()) {
                return false;
            } else {
                if (mode != CLONE) {
                    txt_Codigo.setText(reg.get(0).getId_usuario());

                    if (reg.get(0).getClave().length() > 0) {
                        if (EncryptDecrypt.desencriptar(reg.get(0).getClave()) == null) {
                            txt_Clave.setText(reg.get(0).getClave());
                        } else {
                            txt_Clave.setText(EncryptDecrypt.desencriptar(reg.get(0).getClave()));
                        }
                    }
                }

                txtTrabajador.setText(reg.get(0).getTrabajador());
                txt_CodigoTrabajador.setText(reg.get(0).getId_trabajador());
                txt_TipoTrab.setText(reg.get(0).getTipotrabajador());
                txt_Nombre.setText(reg.get(0).getNombre());
                //reg.get(0).getFlaghabilitado();
                txtp_Clave.setVisible(false);
                txt_Clave.setVisible(true);
                ck_Clave.setSelected(true);

                if (mode == UPDATE) {
                    lbl_NumCar.setForeground(Color.RED);
                } else {
                    lbl_NumCar.setForeground(Color.GRAY);
                }

                if (reg.get(0).getModificar().trim().equals("S")) {
                    ck_Modificar.setSelected(true);
                }
                if (reg.get(0).getEliminar().trim().equals("S")) {
                    ck_Eliminar.setSelected(true);
                }
                if (reg.get(0).getInsertar().trim().equals("S")) {
                    ck_Insertar.setSelected(true);
                }
                /* H: Habilitado  D: Deshabilitado */
                if (reg.get(0).getFlaghabilitado().trim().equals("H")) {
                    ck_Habilitado.setSelected(true);
                }
                chk_Escritorio.setSelected(reg.get(0).getFlagEscritorio().trim().equals("S"));
                chk_Web.setSelected(reg.get(0).getFlagWeb().trim().equals("S"));
                chk_Contable.setSelected(reg.get(0).getFlagContable().trim().equals("S"));
            }

            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
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
        return true;
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
        return true;
    }

    @Override
    public boolean executeSelect() {
        return true;
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
        return true;
    }

    public void focusLost(FocusEvent e) {
    }

    @Override
    public boolean loadRegister(Object o) {
        return true;
    }
}
