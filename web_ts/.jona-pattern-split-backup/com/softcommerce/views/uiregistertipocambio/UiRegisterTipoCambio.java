package com.softcommerce.views.uiregistertipocambio;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanMoneda;
import com.softcommerce.beans.BeanTipoCambio;
import com.softcommerce.beans.Usuario;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.CComboBox;
import java.awt.Component;
import java.awt.event.FocusEvent;
import java.awt.event.MouseEvent;
import java.awt.event.WindowEvent;
import javax.swing.JPanel;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import javax.swing.BorderFactory;
import java.awt.event.KeyListener;
import java.awt.Color;
import java.awt.Font;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import java.awt.Dimension;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.controles.DoubleDocument;
import static com.softcommerce.general.controles.Register.CLONE;
import static com.softcommerce.general.controles.Register.CLONE_OBJECT;
import static com.softcommerce.general.controles.Register.INSERT;
import static com.softcommerce.general.controles.Register.UPDATE;
import com.softcommerce.iconos.Gif;
import java.awt.Frame;
import java.awt.event.FocusListener;
import java.awt.event.MouseListener;
import java.awt.event.WindowListener;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.border.LineBorder;
import com.softcommerce.reglasnegocio.RnTipoCambio;
import com.softcommerce.util.Constans;
import com.softcommerce.util.combo.LoadCombo;
import java.math.BigDecimal;

public class UiRegisterTipoCambio extends JHDialog implements InterUiRegisterTipoCambio, ActionListener, ItemListener, KeyListener, FocusListener, WindowListener, MouseListener {

    private static final long serialVersionUID = 1L;
    private JDateChooser dc_fecha;
    private JButton btn_nuevamoneda;
    private CComboBox cbo_moneda;
    private List<BeanMoneda> x_moneda;
    private JTextField txt_idtipocambio;
    private JTextField txt_montocompra;
    private JTextField txt_montoventa;
    private JTextField txt_montocomercial;
    private JTextField txt_montoespecial;
    private Usuario usuario;
    private String id_moneda;
    private Date fecha;

    public UiRegisterTipoCambio(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    private void inicialize() {
        addWindowListener(this);

        Gif gif = new Gif();

        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245, 245, 245));

        Border border = BorderFactory.createTitledBorder(null, " Datos de Tipo Cambio", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Verdana", 0, 13), Color.BLACK);

        JPanel pnl_SUB_FAMILIA = new JPanel();
        pnl_SUB_FAMILIA.setLayout(null);
        pnl_SUB_FAMILIA.setBackground(new Color(245, 245, 245));
        pnl_SUB_FAMILIA.setBorder(border);

        CLabel lbl_Codigo = new CLabel("Código");
        lbl_Codigo.setBounds(35, 45, 80, 20);
        pnl_SUB_FAMILIA.add(lbl_Codigo);

        txt_idtipocambio = new JTextField();
        txt_idtipocambio.setBounds(120, 45, 80, 20);
        txt_idtipocambio.setEditable(false);
        txt_idtipocambio.addKeyListener(this);
        pnl_SUB_FAMILIA.add(txt_idtipocambio);

        dc_fecha = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dc_fecha.setBounds(120, 80, 110, 20);
        ((JTextField) dc_fecha.getDateEditor()).addFocusListener(this);
        dc_fecha.getJCalendar().addMouseListener(this);
        dc_fecha.getJCalendar().addFocusListener(this);
        dc_fecha.getJCalendar().addKeyListener(this);
        dc_fecha.getCalendarButton().addMouseListener(this);
        dc_fecha.getCalendarButton().addActionListener(this);
        dc_fecha.addMouseListener(this);
        dc_fecha.addKeyListener(this);
        dc_fecha.addFocusListener(this);
        ((JTextField) dc_fecha.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                txt_montocompra.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dc_fecha.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_fecha.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        pnl_SUB_FAMILIA.add(dc_fecha);

        CLabel lblFecha = new CLabel("Fecha");
        lblFecha.setDisplayedMnemonic('c');
        lblFecha.setBounds(35, 80, 80, 20);
        pnl_SUB_FAMILIA.add(lblFecha);

        CLabel lbl_Moneda = new CLabel("Moneda");
        lbl_Moneda.setBounds(35, 115, 80, 20);
        pnl_SUB_FAMILIA.add(lbl_Moneda);

        cbo_moneda = new CComboBox();
        cbo_moneda.setBounds(120, 115, 180, 20);
        cbo_moneda.addKeyListener(this);
        cbo_moneda.setEnabled(false);
        pnl_SUB_FAMILIA.add(cbo_moneda);

        btn_nuevamoneda = new JButton(gif.ADDORANGE);
        btn_nuevamoneda.setBounds(305, 115, 40, 20);
        btn_nuevamoneda.setToolTipText("Nuevo Familia");
        btn_nuevamoneda.addActionListener(this);
        btn_nuevamoneda.addKeyListener(this);
        btn_nuevamoneda.setFocusPainted(false);
        btn_nuevamoneda.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                txt_montocompra.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        pnl_SUB_FAMILIA.add(btn_nuevamoneda);

        CLabel lblMontoCompra = new CLabel("M. Compra");
        lblMontoCompra.setBounds(35, 150, 80, 20);
        pnl_SUB_FAMILIA.add(lblMontoCompra);

        txt_montocompra = new JTextField();
        txt_montocompra.setBounds(120, 150, 110, 20);
        txt_montocompra.setDocument(new DoubleDocument());
        txt_montocompra.addKeyListener(this);
        txt_montocompra.addFocusListener(this);
        pnl_SUB_FAMILIA.add(txt_montocompra);

        CLabel lblMontoVenta = new CLabel("M. Venta");
        lblMontoVenta.setBounds(35, 185, 80, 20);
        pnl_SUB_FAMILIA.add(lblMontoVenta);

        txt_montoventa = new JTextField();
        txt_montoventa.setBounds(120, 185, 110, 20);
        txt_montoventa.setDocument(new DoubleDocument());
        txt_montoventa.addFocusListener(this);
        txt_montoventa.addKeyListener(this);
        pnl_SUB_FAMILIA.add(txt_montoventa);

        CLabel lblMontoComercial = new CLabel("M. Comercial");
        lblMontoComercial.setBounds(35, 220, 80, 20);
        pnl_SUB_FAMILIA.add(lblMontoComercial);

        txt_montocomercial = new JTextField();
        txt_montocomercial.setBounds(120, 220, 110, 20);
        txt_montocomercial.setDocument(new DoubleDocument());
        txt_montocomercial.addFocusListener(this);
        txt_montocomercial.addKeyListener(this);
        pnl_SUB_FAMILIA.add(txt_montocomercial);

        CLabel lblMontoEspecial = new CLabel("M. Especial");
        lblMontoEspecial.setBounds(35, 255, 80, 20);
        pnl_SUB_FAMILIA.add(lblMontoEspecial);

        txt_montoespecial = new JTextField();
        txt_montoespecial.setBounds(120, 255, 110, 20);
        txt_montoespecial.setDocument(new DoubleDocument());
        txt_montoespecial.addFocusListener(this);
        txt_montoespecial.addKeyListener(this);
        pnl_SUB_FAMILIA.add(txt_montoespecial);

        pnl_SUB_FAMILIA.setBounds(25, 25, 385, 290);
        pnl_dialog.add(pnl_SUB_FAMILIA);

        setTitleName("Tipo de Cambio");
        setRegister(pnl_dialog);
        setSize(new Dimension(425, 400));
        ComponentToolKit.centerComponentPosicion(this);
    }

    private BeanTipoCambio getTc() {
        BeanTipoCambio beanTc = new BeanTipoCambio();
        beanTc.setIdTipoCambio(txt_idtipocambio.getText());
        beanTc.setFecha(dc_fecha.getDate());
        beanTc.setBeanMoneda(x_moneda.get(cbo_moneda.getSelectedIndex()-1));
        beanTc.setMontocompra(new BigDecimal(txt_montocompra.getText()));
        beanTc.setMontoventa(new BigDecimal(txt_montoventa.getText()));
        beanTc.setMontocomercial(new BigDecimal(txt_montocomercial.getText()));
        beanTc.setMontoespecial(new BigDecimal(txt_montoespecial.getText()));
        beanTc.setIdUsuario(usuario.getId_usuario());
        beanTc.setIdEmpresa(usuario.getCodempresa());
        return beanTc;
    }

    @Override
    public void loadCombo() {
        loadMoneda();
    }

    public void loadMoneda() {
        try {
            x_moneda = new ArrayList();
            LoadCombo.loadMoneda(path, x_moneda, cbo_moneda,
                    Constans.ITEM_INIT_MONEDA, 0);
        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    @Override
    public void newRegister() {
        JTextField txt = new JTextField();
        cbo_moneda.setBorder(txt.getBorder());
        txt_montocompra.setBorder(txt.getBorder());
        txt_montocomercial.setBorder(txt.getBorder());
        txt_montoventa.setBorder(txt.getBorder());
        txt_montoespecial.setBorder(txt.getBorder());

        txt_idtipocambio.setText("");
        dc_fecha.setDate(new Date());
        txt_montocompra.setText("0.0");
        txt_montoventa.setText("0.0");
        txt_montocomercial.setText("0.0");
        txt_montoespecial.setText("0.0");
        cbo_moneda.setSelectedItem("DOLAR AMERICANO");
        ((JTextFieldDateEditor) dc_fecha.getDateEditor()).requestFocus();
    }

    @Override
    public String executeInsert() {
        try {
            RnTipoCambio regla = new RnTipoCambio(path);
            /*return regla.insertar(dc_fecha.getDate(), 
                    cbo_moneda.getSelectedIndex() > 0 ? x_moneda.get(cbo_moneda.getSelectedIndex() - 1).getId_moneda() : "",
                    Double.valueOf(txt_montocompra.getText().trim()), 
                    Double.valueOf(txt_montoventa.getText().trim()), Double.valueOf(txt_montocomercial.getText().trim()), 
                    Double.valueOf(txt_montoespecial.getText().trim()), usuario.getId_usuario(), usuario.getCodempresa());*/
            return regla.mantTipoCambio(getTc(), "I");
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == ((JTextFieldDateEditor) dc_fecha.getDateEditor())) {
            ((JTextFieldDateEditor) dc_fecha.getDateEditor()).selectAll();
        }

        if (txt_montocomercial == e.getSource()) {
            txt_montocomercial.selectAll();
        }

        if (txt_montocompra == e.getSource()) {
            txt_montocompra.selectAll();
        }

        if (txt_montoventa == e.getSource()) {
            txt_montoventa.selectAll();
        }

        if (txt_montoespecial == e.getSource()) {
            txt_montoespecial.selectAll();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == cbo_moneda) {
                txt_montocompra.requestFocus();
            }

            if (e.getSource() == txt_montocompra) {
                txt_montoventa.requestFocus();
            }

            if (e.getSource() == txt_montoventa) {
                txt_montocomercial.requestFocus();
            }

            if (e.getSource() == txt_montocomercial) {
                txt_montoespecial.requestFocus();
            }

            if (e.getSource() == txt_montoespecial) {
                setFocusAndClick();
            }
        }
    }

    @Override
    public boolean isRegisterValid() {
        try {
            JTextField txt = new JTextField();
            cbo_moneda.setBorder(txt.getBorder());
            dc_fecha.setBorder(new JDateChooser().getBorder());
            txt_montocompra.setBorder(txt.getBorder());
            txt_montoventa.setBorder(txt.getBorder());
            txt_montocomercial.setBorder(txt.getBorder());
            txt_montoespecial.setBorder(txt.getBorder());

            if (((JTextFieldDateEditor) dc_fecha.getDateEditor()).getText().equals("__/__/____")
                    || !DateTime.isValidDate(((JTextFieldDateEditor) dc_fecha.getDateEditor()).getText().replace("_", "0"))) {
                JOptionPane.showMessageDialog(this, "La fecha del Tipo de Cambio que has especificado no es válida. Compruébala e inténtalo de nuevo.", "Datos incompletos de Tipo Cambio", JOptionPane.INFORMATION_MESSAGE);
                ((JTextFieldDateEditor) dc_fecha.getDateEditor()).setBorder(new LineBorder(Color.RED));
                ((JTextFieldDateEditor) dc_fecha.getDateEditor()).requestFocus();

                return false;
            }

            if (cbo_moneda.getSelectedIndex() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Tipo de Cambio, debes " + "especificar su Familia.", "Datos incompletos de Tipo de Cambio", JOptionPane.INFORMATION_MESSAGE);
                cbo_moneda.setBorder(new LineBorder(Color.RED));
                cbo_moneda.requestFocus();

                return false;
            }

            RnTipoCambio logic = new RnTipoCambio(path);
            BeanTipoCambio beanTc = new BeanTipoCambio();
            beanTc.setFecha(dc_fecha.getDate());
            //t.setId_moneda(x_moneda.get(cbo_moneda.getSelectedIndex() - 1).getId_moneda());
            beanTc.setIdEmpresa(usuario.getCodempresa());
            boolean flag = logic.existeTipoCambio(beanTc);

            if (((mode == INSERT) && flag)
                    || ((mode == UPDATE) && flag && !(x_moneda.get(cbo_moneda.getSelectedIndex() - 1).getIdMoneda().equals(id_moneda)) && dc_fecha.getDate().equals(fecha))) {
                JOptionPane.showMessageDialog(this, "La fecha del Tipo Cambio ya se encuentra registrado para esa moneda, por favor ingrese otra fecha o seleccione otra moneda.", "Datos incompletos de Tipo Cambio", JOptionPane.INFORMATION_MESSAGE);
                ((JTextFieldDateEditor) dc_fecha.getDateEditor()).setBorder(new LineBorder(Color.RED));
                ((JTextFieldDateEditor) dc_fecha.getDateEditor()).requestFocus();
                return false;
            }

            if (txt_montocompra.getText().trim().length() == 0 || (Double.valueOf(txt_montocompra.getText().trim()) <= 0)) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Tipo de Cambio , debes " + "especificar su Monto de Compra.", "Datos incompletos de Tipo de Cambio", JOptionPane.INFORMATION_MESSAGE);
                txt_montocompra.setBorder(new LineBorder(Color.RED));
                txt_montocompra.requestFocus();
                return false;
            }

            if ((txt_montoventa.getText().trim().length() == 0) || (Double.valueOf(txt_montoventa.getText().trim()) <= 0)) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Tipo de Cambio , debes " + "especificar su monto de Venta.", "Datos incompletos de Tipo de Cambio", JOptionPane.INFORMATION_MESSAGE);
                txt_montoventa.setBorder(new LineBorder(Color.RED));
                txt_montoventa.requestFocus();
                return false;
            }
            if (txt_montocomercial.getText().trim().length() == 0 || (Double.valueOf(txt_montocomercial.getText().trim()) <= 0)) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Tipo de Cambio , debes " + "especificar su Monto Comercial.", "Datos incompletos de Tipo de Cambio", JOptionPane.INFORMATION_MESSAGE);
                txt_montocomercial.setBorder(new LineBorder(Color.RED));
                txt_montocomercial.requestFocus();
                return false;
            }
            if (txt_montoespecial.getText().trim().length() == 0 || (Double.valueOf(txt_montoespecial.getText().trim()) <= 0)) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Tipo de Cambio , debes " + "especificar su Monto Comercial.", "Datos incompletos de Tipo de Cambio", JOptionPane.INFORMATION_MESSAGE);
                txt_montoespecial.setBorder(new LineBorder(Color.RED));
                txt_montoespecial.requestFocus();
                return false;
            }

            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    @Override
    @SuppressWarnings("deprecation")
    public boolean loadRegister() {
        try {
            RnTipoCambio logicTc = new RnTipoCambio(path);
            BeanTipoCambio beanTc = logicTc.getBeanTipoCambio(rowSelection.getSelectedValue(0).toString());
            if (beanTc == null) {
                return false;
            } else {
                fecha = beanTc.getFecha();
                id_moneda = beanTc.getBeanMoneda().getIdMoneda();
                txt_idtipocambio.setText(((mode == CLONE) || (mode == CLONE_OBJECT)) ? "" : beanTc.getIdTipoCambio());
                cargarMoneda(id_moneda);
                dc_fecha.setDate(((mode == CLONE) || (mode == CLONE_OBJECT)) ? new Date() : beanTc.getFecha());
                txt_montocompra.setText(beanTc.getMontocompra().toString());
                txt_montoventa.setText(beanTc.getMontoventa().toString());
                txt_montocomercial.setText(beanTc.getMontocomercial().toString());
                txt_montoespecial.setText(beanTc.getMontoespecial().toString());
            }

            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    @Override
    @SuppressWarnings("deprecation")
    public boolean loadRegister(Object o) {
        try {
            BeanTipoCambio beanTc = (BeanTipoCambio) o;

            RnTipoCambio logicTc = new RnTipoCambio(path);
            beanTc = logicTc.getBeanTipoCambio(new java.sql.Date(beanTc.getFecha().getTime()),
                    beanTc.getBeanMoneda().getIdMoneda());
            if (beanTc == null) {
                return false;
            } else {
                fecha = beanTc.getFecha();
                id_moneda = beanTc.getBeanMoneda().getIdMoneda();
                txt_idtipocambio.setText(((mode == CLONE) || (mode == CLONE_OBJECT)) ? "" : beanTc.getIdTipoCambio());
                cargarMoneda(id_moneda);
                dc_fecha.setDate(((mode == CLONE) || (mode == CLONE_OBJECT)) ? new Date() : beanTc.getFecha());
                txt_montocompra.setText(beanTc.getMontocompra().toString());
                txt_montoventa.setText(beanTc.getMontoventa().toString());
                txt_montocomercial.setText(beanTc.getMontocomercial().toString());
                txt_montoespecial.setText(beanTc.getMontoespecial().toString());
            }

            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    public void cargarMoneda(String codiMoneda) {
        if (x_moneda != null) {
            for (int i = 0; i < x_moneda.size(); i++) {
                if (x_moneda.get(i).getIdMoneda().equals(codiMoneda)) {
                    cbo_moneda.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    @Override
    public String executeUpdate() {
        try {
            RnTipoCambio regla = new RnTipoCambio(path);
            /*return regla.modificar(
                    txt_idmoneda.getText().trim(), dc_fecha.getDate(), cbo_moneda.getSelectedIndex() > 0 ? x_moneda.get(cbo_moneda.getSelectedIndex() - 1).getId_moneda() : "", Double.valueOf(txt_montocompra.getText().trim()), Double.valueOf(txt_montoventa.getText().trim()), Double.valueOf(txt_montocomercial.getText().trim()), Double.valueOf(txt_montoespecial.getText().trim()), usuario.getId_usuario(), usuario.getCodempresa());*/
            return regla.mantTipoCambio(getTc(), "A");
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    @Override
    public boolean executeDelete() {
        try {
            RnTipoCambio regla = new RnTipoCambio(path);
            regla.mantTipoCambio(getTc(), "E");
            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
    }

    @Override
    public void setRegisterEnabled(boolean e) {
        btn_nuevamoneda.setEnabled(e);
        dc_fecha.setEnabled(e);
    }

    @Override
    public void setRegisterEditable(boolean e) {
        txt_montocomercial.setEditable(e);
        txt_montocompra.setEditable(e);
        txt_montoespecial.setEditable(e);
        txt_montoventa.setEditable(e);
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_montocomercial && txt_montocomercial.getText().trim().length() == 0) {
            txt_montocomercial.setText("0.0");
        }

        if (e.getSource() == txt_montocompra && txt_montocompra.getText().trim().length() == 0) {
            txt_montocompra.setText("0.0");
        }

        if (e.getSource() == txt_montoventa && txt_montoventa.getText().trim().length() == 0) {
            txt_montoventa.setText("0.0");
        }

        if (e.getSource() == txt_montoespecial && txt_montoespecial.getText().trim().length() == 0) {
            txt_montoespecial.setText("0.0");
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    @Override
    public void showMessagePrint(String codigo) {
    }

    @Override
    public boolean executeAnular() {
        return true;
    }

    @Override
    public void mouseClicked(MouseEvent e) {
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public boolean executeSelect() {
        return true;
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
    }

    @Override
    public void keyTyped(KeyEvent e) {
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
}
