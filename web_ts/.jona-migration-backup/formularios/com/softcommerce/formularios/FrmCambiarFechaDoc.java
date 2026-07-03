/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.formularios;

import com.softcommerce.beans.Usuario;
import com.softcommerce.conta.formularios.PnlAsientoContable;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnRegconta;
import com.softcommerce.util.FxTipoDocVenta;
import com.softcommerce.util.Propiedad;
import com.softcommerce.util.Util;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyEvent;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import java.net.URL;
import java.util.Date;

public class FrmCambiarFechaDoc
        extends JDialog
        implements ActionListener, FocusListener {

    private URL path;
    private Main frmMain;
    private Usuario usuario;
    private Gif gif;
    private JButton btnAceptar;
    private JButton btnCancelar;
    private JDateChooser dc_femision;
    private JDateChooser dc_fcontable;
    private String idAuxiliar;
    private String idRegconta;
    private String mesDoc;
    private JTextField txtTipoDoc;
    private JTextField txtTipoDocDesc;
    private JTextField txtSerie;
    private JTextField txtPreimpreso;
    PnlAsientoContable pnlAsientoContable;

    public static void main(String[] args) {
        FrmCambiarFechaDoc theEntry = new FrmCambiarFechaDoc();
        theEntry.setVisible(true);
    }

    public FrmCambiarFechaDoc() {
        super();
        Propiedad p = new Propiedad();
        this.path = p.getDbSys();
        inicialize();
    }

    public FrmCambiarFechaDoc(Main frmMain, PnlAsientoContable pnlAsientoContable, Usuario usuario, URL path) {
        super(frmMain, true);
        this.frmMain = frmMain;
        this.usuario = usuario;
        this.path = path;
        this.pnlAsientoContable = pnlAsientoContable;
        inicialize();
    }

    private void inicialize() {
        gif = new Gif();
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.add(getPnlGeneral(), BorderLayout.CENTER);
        this.getContentPane().add(pnl);
        //this.setfecha();
        setMinimumSize(new Dimension(600, 150));
        initListener();
        this.setResizable(false);
        this.pack();
        setLocation(0, 0);
    }

    private JPanel getPnlGeneral() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.add(getPnlDatos(), BorderLayout.CENTER);
        pnl.add(getPnlOpciones(), BorderLayout.SOUTH);
        return pnl;
    }

    private JPanel getPnlDatos() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        Border border = BorderFactory.createTitledBorder(null, "Datos", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnlPrinc.setBorder(border);
        JPanel pnl = new JPanel();
        pnlPrinc.add(pnl, BorderLayout.WEST);
        pnl.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        //gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.anchor = GridBagConstraints.WEST;
        gbc.insets = new Insets(2, 2, 2, 2);

        JLabel lblTipoDoc = new JLabel("Tipo Doc");
        pnl.add(lblTipoDoc, gbc);
        gbc.gridx = 1;
        txtTipoDoc = new JTextField();
        txtTipoDoc.setEditable(false);
        txtTipoDoc.setColumns(2);
        txtTipoDoc.setMinimumSize(txtTipoDoc.getPreferredSize());
        gbc.insets = new Insets(2, 1, 2, 0);
        pnl.add(txtTipoDoc, gbc);

        txtTipoDocDesc = new JTextField();
        txtTipoDocDesc.setColumns(15);
        txtTipoDocDesc.setEnabled(false);
        gbc.insets = new Insets(2, 0, 2, 0);
        gbc.gridx = 2;
        //gbc.fill = GridBagConstraints.HORIZONTAL;
        pnl.add(txtTipoDocDesc, gbc);
        //gbc.fill = GridBagConstraints.NONE;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.gridx = 3;
        JLabel lblDoc = new JLabel("N° Documento");
        pnl.add(lblDoc, gbc);

        gbc.gridx = 4;
        gbc.insets = new Insets(2, 1, 2, 0);
        txtSerie = new JTextField();
        txtSerie.setColumns(3);
        txtSerie.setEditable(false);
        pnl.add(txtSerie, gbc);

        gbc.gridx = 5;
        gbc.insets = new Insets(2, 0, 2, 2);
        txtPreimpreso = new JTextField();
        txtPreimpreso.setEditable(false);
        txtPreimpreso.setColumns(8);
        pnl.add(txtPreimpreso, gbc);
        gbc.insets = new Insets(2, 2, 2, 2);

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblFContable = new JLabel("F Contable");
        pnl.add(lblFContable, gbc);
        gbc.gridx = 1;
        gbc.gridwidth = 2;
        dc_fcontable = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        pnl.add(dc_fcontable, gbc);
        gbc.gridwidth = 1;
        gbc.gridx = 3;
        JLabel lblFEmision = new JLabel("F Emision");
        pnl.add(lblFEmision, gbc);
        gbc.gridx = 4;
        gbc.gridwidth = 2;
        dc_femision = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        pnl.add(dc_femision, gbc);
        return pnlPrinc;
    }

    private JPanel getPnlOpciones() {
        JPanel pnlPrinc = new JPanel();
        btnAceptar = new JButton("Aceptar", gif.SAVE16);
        pnlPrinc.add(btnAceptar);
        btnCancelar = new JButton("Cancelar", gif.CANCEL16);
        pnlPrinc.add(btnCancelar);
        return pnlPrinc;
    }

    public void setfecha(Date fechaEmision, Date fechaContable) {
        dc_femision.setSelectableDateRange(DateTime.format(100, 0, 1), fechaContable);
        dc_femision.setDate(fechaEmision);
        dc_fcontable.setSelectableDateRange(frmMain.getFechaInicio(), frmMain.getFechaFin());
        dc_fcontable.setDate(fechaContable);
    }

    private void limitfEmision() {
        dc_femision.setSelectableDateRange(DateTime.format(100, 0, 1), dc_fcontable.getDate());
    }

    private void initListener() {
        btnAceptar.addActionListener(this);
        btnCancelar.addActionListener(this);
        ((JTextFieldDateEditor) dc_fcontable.getDateEditor()).addFocusListener(this);
        dc_fcontable.getCalendarButton().addActionListener(this);
        ((JTextField) dc_fcontable.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                limitfEmision();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dc_fcontable.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_fcontable.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextFieldDateEditor) dc_femision.getDateEditor()).addFocusListener(this);
        dc_femision.getCalendarButton().addActionListener(this);
        ((JTextField) dc_femision.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_femision.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
    }

    private void cambiarFecha() throws Exception {
        try {
            if (!this.isRegisterValid()) {
                return;
            }
            String mes = Util.getMes(dc_fcontable.getDate());
            if (mes.equals(this.mesDoc)) {
                this.cambiarSoloFecha();
            } else {
                this.cambiarFechaVoucher(Util.getAnio(dc_fcontable.getDate()), mes);
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void cambiarSoloFecha() throws Exception {
        try {
            RnRegconta logic = new RnRegconta(path);
            String rpta = logic.updateFecha(this.idRegconta, dc_femision.getDate(), dc_fcontable.getDate());
            JOptionPane.showMessageDialog(this, rpta);
            this.pnlAsientoContable.CargarAsientos();
            this.dispose();
        } catch (Exception e) {
            throw e;
        }
    }

    private void cambiarFechaVoucher(String anio, String nuevoMes) throws Exception {
        try {
            int xres = JOptionPane.showConfirmDialog(this, "La operacion se actualizara en \nPeriodo: " + anio + "-" + nuevoMes,
                    "Sistema", JOptionPane.OK_CANCEL_OPTION, JOptionPane.QUESTION_MESSAGE);
            if (xres != JOptionPane.OK_OPTION) {
                return;
            }
            RnRegconta logic = new RnRegconta(path);
            String voucher = logic.updateFechaMes(this.idRegconta, dc_femision.getDate(), dc_fcontable.getDate(),
                    usuario.getCodempresa(), this.idAuxiliar, anio, nuevoMes);
            JOptionPane.showMessageDialog(this, "Registro Actualizado\nN° de Voucher: " + voucher);
            this.pnlAsientoContable.CargarAsientos();
            this.dispose();
        } catch (Exception e) {
            throw e;
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        try {
            if (e.getSource().equals(btnCancelar)) {
                this.dispose();
            }
            if (e.getSource().equals(btnAceptar)) {
                this.cambiarFecha();
            }
            if (dc_fcontable.getCalendarButton() == e.getSource()) {
                limitfEmision();
                ((JTextFieldDateEditor) dc_fcontable.getDateEditor()).requestFocus();
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    private boolean isRegisterValid() throws Exception {
        try {
            if (((JTextFieldDateEditor) dc_fcontable.getDateEditor()).getText().equals("__/__/____")
                    || !DateTime.isValidDate(((JTextFieldDateEditor) dc_fcontable.getDateEditor()).getText())) {
                JOptionPane.showMessageDialog(this, "La fecha Contable que has especificado no es válida. Compruébala e inténtalo de nuevo.");
                dc_fcontable.requestFocus();
                return false;
            }
            if (dc_fcontable.getDate().before(dc_fcontable.getMinSelectableDate())
                    || dc_fcontable.getDate().after(dc_fcontable.getMaxSelectableDate())) {
                JOptionPane.showMessageDialog(this, "Ingrese Fecha Correctamente");
                dc_fcontable.requestFocus();
                return false;
            }
            RnRegconta logic = new RnRegconta(path);
            String mes = Util.getMes(dc_fcontable.getDate());
            String rpta = logic.estadoPeriodoAuxiliar(Util.getIdPeriodoMensual(Util.getAnio(dc_fcontable.getDate()), mes, idAuxiliar),
                    idAuxiliar);
            if (rpta.trim().substring(0, 1).equals("*")) {
                JOptionPane.showMessageDialog(this, rpta);
                return false;
            }
            return true;
        } catch (Exception e) {
            throw e;
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (((JTextFieldDateEditor) dc_fcontable.getDateEditor()) == e.getSource()) {
            ((JTextFieldDateEditor) dc_fcontable.getDateEditor()).selectAll();
        }
        if (((JTextFieldDateEditor) dc_femision.getDateEditor()) == e.getSource()) {
            ((JTextFieldDateEditor) dc_femision.getDateEditor()).selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (((JTextFieldDateEditor) dc_fcontable.getDateEditor()) == e.getSource()) {
            limitfEmision();
        }
    }

    public void setIdAuxiliar(String idAuxiliar) {
        this.idAuxiliar = idAuxiliar;
    }

    public void setIdRegconta(String idRegconta) {
        this.idRegconta = idRegconta;
    }

    public void setMesDoc(String mesDoc) {
        this.mesDoc = mesDoc;
    }

    public void setIdTipoDoc(String idTipoDoc) {
        this.txtTipoDoc.setText(idTipoDoc);
        FxTipoDocVenta.buscarTipoDocVenta(txtTipoDoc, txtTipoDocDesc, "", "", "",
                false, frmMain, path, this);
    }

    public void setSerie(String serie) {
        this.txtSerie.setText(serie);
    }

    public void setPreimpreso(String preimpreso) {
        this.txtPreimpreso.setText(preimpreso);
    }

}
