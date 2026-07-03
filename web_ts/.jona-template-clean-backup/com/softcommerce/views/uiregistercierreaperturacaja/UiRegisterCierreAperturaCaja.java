package com.softcommerce.views.uiregistercierreaperturacaja;

import com.softcommerce.views.uipaneltfcierreaperturacaja.UiPanelTFCierreAperturaCaja;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.CierreCaja;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CComboBox;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import java.awt.Component;
import com.softcommerce.general.controles.CDialog;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.iconos.Gif;
import com.softcommerce.general.controles.Register;
import java.awt.BorderLayout;
import java.awt.event.FocusEvent;
import javax.swing.JPanel;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import javax.swing.BorderFactory;
import java.awt.event.KeyListener;
import java.awt.Color;
import java.awt.Cursor;
import java.awt.Dialog;
import java.awt.Font;
import javax.swing.border.TitledBorder;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Frame;
import java.awt.event.FocusListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Vector;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFormattedTextField;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.border.Border;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import javax.swing.text.DefaultFormatterFactory;
import javax.swing.text.MaskFormatter;
import com.softcommerce.reglasnegocio.rn_CierraCaja;
import com.softcommerce.reglasnegocio.RnPuntoVenta;

public class UiRegisterCierreAperturaCaja extends CDialog implements InterUiRegisterCierreAperturaCaja, ActionListener, ItemListener, KeyListener, FocusListener, Register {

    protected SimpleDateFormat formato;
    protected JTextField txtcodigo;
    protected JTextField txtmonto;
    protected JTextField txtempresa;
    protected JTextField txtpuntoventa;
    protected JFormattedTextField txtfechaemision;
    protected UiPanelTFCierreAperturaCaja pnltf;
    protected int mode = 0;
    protected Gif gif;
    protected Usuario usuario;
    protected JComboBox cboestado;
    protected Vector vtrestado;
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
    protected CComboBox cbpuntoventa;
    protected Vector vtrpuntoventa;
    protected Vector<PuntoVenta> xpuntoventa;

    public UiRegisterCierreAperturaCaja(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public UiRegisterCierreAperturaCaja(Frame frame, Usuario usuario, UiPanelTFCierreAperturaCaja pnltf) {
        super(frame);
        this.usuario = usuario;
        this.pnltf = pnltf;
        inicialize();
    }

    public JPanel configurarPanelOperaciones() {
        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245, 245, 245));

        Border border = BorderFactory.createTitledBorder(null, " Datos de Apertura de Caja ", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Verdana", 0, 13), Color.BLACK);

        JPanel pnlempresa = new JPanel();
        pnlempresa.setLayout(null);
        pnlempresa.setBackground(new Color(245, 245, 245));
        pnlempresa.setBorder(border);

        CLabel lblcodigo = new CLabel("CÃ³digo");
        lblcodigo.setBounds(35, 45, 50, 20);
        pnlempresa.add(lblcodigo);

        txtcodigo = new JTextField();
        txtcodigo.setBounds(105, 45, 120, 20);
        txtcodigo.setEditable(false);
        pnlempresa.add(txtcodigo);

        MaskFormatter mfFecha = null;

        try {
            mfFecha = new MaskFormatter("##/##/####");
            mfFecha.setPlaceholderCharacter('0');
        } catch (ParseException localParseException) {
        }

        DefaultFormatterFactory facFecha = new DefaultFormatterFactory(mfFecha, mfFecha, mfFecha);

        CLabel lbl_puntoventa = new CLabel("Punto Venta");
        lbl_puntoventa.setBounds(35, 80, 80, 20);
        pnlempresa.add(lbl_puntoventa);

        vtrpuntoventa = new Vector();
        cbpuntoventa = new CComboBox(vtrpuntoventa);
        cbpuntoventa.setBounds(105, 80, 230, 20);
        cbpuntoventa.addKeyListener(this);
        pnlempresa.add(cbpuntoventa);

        txtfechaemision = new JFormattedTextField();
        txtfechaemision.addKeyListener(this);
        txtfechaemision.setBounds(105, 115, 80, 20);
        txtfechaemision.setFont(new JTextField().getFont());
        txtfechaemision.addFocusListener(this);
        txtfechaemision.setFormatterFactory(facFecha);
        pnlempresa.add(txtfechaemision);

        JLabel lblfechaemision = new JLabel("F. Emision");
        lblfechaemision.setDisplayedMnemonic('c');
        lblfechaemision.setLabelFor(txtfechaemision);
        lblfechaemision.setBounds(35, 115, 70, 20);
        pnlempresa.add(lblfechaemision);

        CLabel lblmonto = new CLabel("Monto");
        lblmonto.setBounds(35, 150, 50, 20);
        pnlempresa.add(lblmonto);

        txtmonto = new JTextField();
        txtmonto.addFocusListener(this);
        txtmonto.addKeyListener(this);
        txtmonto.setBounds(105, 150, 100, 20);
        txtmonto.setEditable(false);
        txtmonto.setDocument(new UpperCaseNumberDocument(255));
        pnlempresa.add(txtmonto);

        JLabel lblestado = new JLabel("Estado");
        lblestado.setBounds(35, 185, 50, 20);
        lblestado.setFont(new Font("Verdana", 0, 11));
        pnlempresa.add(lblestado);

        vtrestado = new Vector();
        cboestado = new JComboBox(vtrestado);
        cboestado.setBounds(105, 185, 70, 20);
        cboestado.addKeyListener(this);
        cboestado.addActionListener(this);
        pnlempresa.add(cboestado);

        txtempresa = new JTextField();
        txtempresa.setBounds(755, 320, 100, 20);
        txtempresa.setVisible(false);
        pnlempresa.add(txtempresa);

        txtpuntoventa = new JTextField();
        txtpuntoventa.setBounds(755, 320, 100, 20);
        txtpuntoventa.setVisible(false);
        pnlempresa.add(txtpuntoventa);

        pnlempresa.setBounds(20, 20, 345, 225);
        pnl_dialog.add(pnlempresa);

        return pnl_dialog;
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
        formato = new SimpleDateFormat("dd/MM/yyyy");

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
        setSize(new Dimension(400, 335));
        ComponentToolKit.centerComponentPosicion(this);

        titleName = "Apertura de Caja";
        titleAnular = "Anular ";
        titleInsert = "Agregar ";
        titleUpdate = "Modificar ";
        titleDelete = "Eliminar ";
        titleDetail = "Detalle de ";
    }

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

    public void onClickOk() {
    }

    public void insert() {
    }

    public void delete() {
    }

    public void update() {
    }

    public void setRegisterEnabled(boolean e) {
        cbpuntoventa.setEnabled(e);
        cboestado.setEnabled(e);
    }

    public void loadCombo() {
    }

    public void loadEstado() {
    }

    public void newRegister() {
    }

    public void setRegisterEditable(boolean e) {
        txtfechaemision.setEditable(e);
    }

    public String executeInsert() {
        return null;
    }

    public String executeUpdate() {
        return null;
    }

    public boolean executeDelete() {
        return false;
    }

    public boolean loadRegister() {
        return false;
    }

    public void focusGained(FocusEvent e) {
        if (e.getSource() == txtmonto) {
            txtmonto.selectAll();
        }
    }

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
    }

    public void loadPuntoVenta() {
    }

    public void cargarPuntoventa(String id_puntoventa) {
    }

    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }

        if (e.getKeyChar() == '\n') {
            if (e.getSource() == cboestado) {
                cbOk.requestFocus();
            }
        }
    }

    public boolean isRegisterValid() {
        return false;
    }

    public void setValueSearch(Object codigo, Component comp) {
    }

    public void addRow(String[] reg) {
    }

    public void addRow(Object[] reg) {
    }

    public boolean executeDetail() {
        return false;
    }

    public void showMessageSuccessfulInsert() {
    }

    public void showMessageSuccessfulUpdate() {
    }

    public void showMessageSuccessfulDelete() {
    }

    public void showMessageErrorInsert() {
    }

    public void showMessageErrorUpdate() {
    }

    public void showMessageErrorDelete() {
    }

    public boolean showConfirmDelete() {
        return false;
    }

    public void setParametersRegister(ArrayList data, String[] columnNames) {
    }

    public boolean executeSelect() {
        return false;
    }

    public void itemStateChanged(ItemEvent e) {
    }

    public void keyTyped(KeyEvent e) {
    }

    public void keyReleased(KeyEvent e) {
    }

    public void showMessagePrint(String codigo) {
    }

    public void loadInicio() {
    }

    public void showSearchDialog() {
    }

    public void loadInicioUDD() {
    }

    public void loadInicioInsert() {
    }

    public void addRow(Object ob, int index) {
    }

    public void addRow(Object ob, int index, int cantidad) {
    }

    public void addRow(Object ob, int index, int cantidad, double participacion) {
    }

    public void removeRow(Object ob, int opcion) {
    }

    public void addRow(Object ob, int cantidad, double participacion) {
    }

    public void addDataRow(Object ob, int cantidad, double participacion) {
    }

    public void updateRow(Object ob, int opcion) {
    }

    public void addRow(Object ob) {
    }

    public void loadInicioUpdate() {
    }

    public void loadInicioBeforeDetail() {
    }

    public void loadInicioAfterDetail() {
    }

    public void loadInicioDelete() {
    }

    public void addRow(Object ob, Component comp) {
    }

    public void addRow(Object[] reg, int opcion) {
    }

    public ArrayList getDataTable() {
        return null;
    }

    public void addRow(Object reg[], String opcion) {
    }

    public void removeRow(Object reg[], String opcion) {
    }

    public void updateRow(Object reg[], String opcion) {
    }

    public void addRow(Object ob, String opcion) {
    }

    public void removeRow(Object ob, String opcion) {
    }

    public void updateRow(Object ob, String opcion) {
    }

    public void addRow(Object[] ob, Component comp, int modo) {
    }

    public void removeRow(Object ob, Component comp, int modo) {
    }

    public void updateRow(Object[] ob, Component comp, int modo) {
    }

    public void focusLost(FocusEvent e) {
    }

    public boolean executeAnular() {
        return false;
    }

    public void prepareRegister() {
    }
}

