package com.softcommerce.views.uicambiarcondicionpago;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanCondicionPago;
import com.softcommerce.beans.BeanMoneda;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.TipoOperacion;
import com.softcommerce.beans.BeanTipoPago;
import com.softcommerce.beans.Usuario;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import com.softcommerce.general.controles.CDialog;
import com.softcommerce.iconos.Gif;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Toolkit;
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
import java.awt.event.WindowFocusListener;
import java.awt.event.WindowListener;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.border.Border;
import javax.swing.border.EmptyBorder;
import javax.swing.border.TitledBorder;
import com.softcommerce.reglasnegocio.rn_CondicionPago;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.reglasnegocio.RnTipoOperacion;
import com.softcommerce.reglasnegocio.RnTipoPago;
import javax.swing.JOptionPane;

public class UiCambiarCondicionPago extends CDialog implements InterUiCambiarCondicionPago, ActionListener, KeyListener, FocusListener, WindowFocusListener, WindowListener, ItemListener, MouseListener, PropertyChangeListener {

    private JComboBox cbMoneda;
    private List<BeanMoneda> xmoneda;
    private JComboBox cboDiasPago;
    private List<BeanCondicionPago> xcondpago;
    private JComboBox cboMedioPago;
    private List<BeanTipoPago> xmediopago;
    private JComboBox cboCondicionPago;
    private JComboBox cboCancelaEn;
    private JButton cbCancelar;
    private JButton cbGuardar;
    private JTextField txt_tipooperacion;
    private JTextField txt_tipocambio;
    private JTextField txt_idregconta;
    private JTextField txt_documento;
    private JDateChooser dc_fvencimiento;
    private Usuario usuario;
    private java.net.URL path;

    public UiCambiarCondicionPago(JFrame frm, Usuario usuario, java.net.URL path) {
        super(frm);
        this.path = path;
        this.usuario = usuario;
        initialize();
    }

    private void initialize() {
        addWindowListener(this);
        addKeyListener(this);

        Gif gif = new Gif();

        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());

        JLabel lblTitle = new JLabel("Cambiar Condicion de Pago");
        lblTitle.setOpaque(true);
        lblTitle.setFont(new Font(lblTitle.getFont().getFontName(), 1, 14));
        lblTitle.setForeground(new Color(255, 255, 255));
        lblTitle.setBackground(new Color(117, 140, 220));
        lblTitle.setPreferredSize(new Dimension(0, 25));
        lblTitle.setBorder(new EmptyBorder(0, 10, 0, 0));
        pnl.add(lblTitle, BorderLayout.NORTH);

        JPanel pnlSelecDoc = new JPanel(null);
        pnlSelecDoc.setBackground(new Color(245, 245, 245));

        JLabel lblCodigo = new JLabel("Codigo");
        lblCodigo.setBounds(10, 5, 40, 20);
        pnlSelecDoc.add(lblCodigo);

        txt_idregconta = new JTextField();
        txt_idregconta.setEditable(false);
        txt_idregconta.setBounds(50, 5, 90, 20);
        pnlSelecDoc.add(txt_idregconta);

        JLabel lbl_documento = new JLabel("Documento");
        lbl_documento.setBounds(165, 5, 65, 20);
        pnlSelecDoc.add(lbl_documento);

        txt_documento = new JTextField();
        txt_documento.setEditable(false);
        txt_documento.setBounds(230, 5, 150, 20);
        pnlSelecDoc.add(txt_documento);

        Border borderFormaPago = BorderFactory.createTitledBorder(null, "Forma de Pago y Moneda", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);

        JPanel pnlFormaPago = new JPanel();
        pnlFormaPago.setLayout(null);
        pnlFormaPago.setBorder(borderFormaPago);
        pnlFormaPago.setBackground(new Color(245, 245, 245));

        JLabel lblCondicionPago = new JLabel("C. Pago");
        lblCondicionPago.setBounds(20, 25, 60, 20);
        lblCondicionPago.setFont(new Font("Verdana", 0, 11));
        pnlFormaPago.add(lblCondicionPago);

        cboCondicionPago = new JComboBox();
        cboCondicionPago.setBounds(70, 25, 205, 20);
        cboCondicionPago.addKeyListener(this);
        cboCondicionPago.addActionListener(this);
        pnlFormaPago.add(cboCondicionPago);

        JLabel lblMedioPago = new JLabel("T. Pago");
        lblMedioPago.setBounds(20, 85, 60, 20);
        lblMedioPago.setFont(new Font("Verdana", 0, 11));
        pnlFormaPago.add(lblMedioPago);

        cboMedioPago = new JComboBox();
        cboMedioPago.setBounds(70, 85, 205, 20);
        cboMedioPago.addKeyListener(this);
        cboMedioPago.addActionListener(this);
        pnlFormaPago.add(cboMedioPago);

        JLabel lblCancelaEn = new JLabel("Cancela en ");
        lblCancelaEn.setBounds(300, 85, 75, 20);
        lblCancelaEn.setFont(new Font("Verdana", 1, 11));
        lblCancelaEn.setForeground(new Color(10, 52, 10));
        pnlFormaPago.add(lblCancelaEn);

        cboCancelaEn = new JComboBox();
        cboCancelaEn.setBounds(380, 85, 170, 20);
        cboCancelaEn.addKeyListener(this);
        cboCancelaEn.addActionListener(this);
        pnlFormaPago.add(cboCancelaEn);

        JLabel lblDiasPago = new JLabel("T. Dias");
        lblDiasPago.setFont(new Font("Verdana", 0, 11));
        lblDiasPago.setBounds(295, 25, 40, 20);
        pnlFormaPago.add(lblDiasPago);

        cboDiasPago = new JComboBox();
        cboDiasPago.setBounds(340, 25, 160, 20);
        cboDiasPago.addKeyListener(this);
        cboDiasPago.addActionListener(this);
        cboDiasPago.setEnabled(false);
        pnlFormaPago.add(cboDiasPago);


        JLabel lblFechaVence = new JLabel("F Vence");
        lblFechaVence.setDisplayedMnemonic('c');
        lblFechaVence.setBounds(515, 25, 70, 20);
        pnlFormaPago.add(lblFechaVence);

        dc_fvencimiento = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dc_fvencimiento.setBounds(565, 25, 85, 20);
        dc_fvencimiento.getJCalendar().addMouseListener(this);
        dc_fvencimiento.getJCalendar().addFocusListener(this);
        dc_fvencimiento.getJCalendar().addKeyListener(this);
        dc_fvencimiento.getCalendarButton().addMouseListener(this);
        dc_fvencimiento.getCalendarButton().addActionListener(this);
        dc_fvencimiento.addPropertyChangeListener(this);
        dc_fvencimiento.addMouseListener(this);
        dc_fvencimiento.addKeyListener(this);
        dc_fvencimiento.addFocusListener(this);
        ((JTextFieldDateEditor) dc_fvencimiento.getDateEditor()).addFocusListener(this);
        ((JTextField) dc_fvencimiento.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                cboCondicionPago.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dc_fvencimiento.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_fvencimiento.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        pnlFormaPago.add(dc_fvencimiento);

        JLabel lblMoneda = new JLabel("Moneda");
        lblMoneda.setFont(new Font("Verdana", 0, 11));
        lblMoneda.setBounds(20, 55, 45, 20);
        pnlFormaPago.add(lblMoneda);

        cbMoneda = new JComboBox();
        cbMoneda.setBounds(70, 55, 180, 20);
        cbMoneda.addActionListener(this);
        cbMoneda.addKeyListener(this);
        pnlFormaPago.add(cbMoneda);

        JLabel lbl_tipocambio = new JLabel("T. Cambio");
        lbl_tipocambio.setBounds(275, 55, 70, 20);
        lbl_tipocambio.setFont(new Font("Verdana", 0, 11));
        pnlFormaPago.add(lbl_tipocambio);

        txt_tipocambio = new JTextField();
        txt_tipocambio.setBounds(340, 55, 60, 20);
        txt_tipocambio.addKeyListener(this);
        txt_tipocambio.setEditable(false);
        pnlFormaPago.add(txt_tipocambio);

        JLabel lbl_tipooperacion = new JLabel("T. Operacion");
        lbl_tipooperacion.setBounds(420, 55, 90, 20);
        lbl_tipooperacion.setFont(new Font("Verdana", 0, 11));
        pnlFormaPago.add(lbl_tipooperacion);

        txt_tipooperacion = new JTextField();
        txt_tipooperacion.setBounds(510, 55, 100, 20);
        txt_tipooperacion.setFont(new Font("Comic Sans Serif", Font.PLAIN, 12));
        txt_tipooperacion.addKeyListener(this);
        txt_tipooperacion.addFocusListener(this);
        txt_tipooperacion.setEditable(false);
        pnlFormaPago.add(txt_tipooperacion);

        pnlFormaPago.setBounds(5, 35, 655, 120);
        pnlSelecDoc.add(pnlFormaPago);

        cbCancelar = new JButton("Cancelar", gif.CANCEL16);
        cbCancelar.addActionListener(this);
        cbCancelar.addKeyListener(this);
        cbCancelar.setOpaque(false);
        cbCancelar.setBounds(5, 160, 120, 30);
        pnlSelecDoc.add(cbCancelar);

        cbGuardar = new JButton("Guardar", gif.SAVE16);
        cbGuardar.addActionListener(this);
        cbGuardar.addKeyListener(this);
        cbGuardar.setOpaque(false);
        cbGuardar.setBounds(540, 160, 120, 30);
        pnlSelecDoc.add(cbGuardar);

        pnl.add(pnlSelecDoc, BorderLayout.CENTER);

        setTitle("Datos de la Condicion de Pago del Documento");
        setBackground(new Color(245, 245, 245));
        setContentPane(pnl);
        setModal(true);
        setResizable(false);
        setSize(675, 255);

        loadCondPago();
    }

    public void loadCondPago() {
        cboCondicionPago.addItem("--- Seleccione Condicion de Pago ---");
        cboCondicionPago.addItem("CONTADO");
        cboCondicionPago.addItem("CREDITO");
        cboCondicionPago.setSelectedItem("CONTADO");
    }

    public void loadDiasPago(String xmediopago) {
        rn_CondicionPago regla = new rn_CondicionPago(path);

        if (xcondpago != null) {
            xcondpago.clear();
        } else {
            xcondpago = new ArrayList<BeanCondicionPago>();
        }

        xcondpago.addAll(regla.listar("", "", -1, xmediopago));

        cboDiasPago.removeAllItems();
        cboDiasPago.addItem("--- Seleccione Cant. Dias ---");

        for (int i = 0; i < xcondpago.size(); i++) {
            cboDiasPago.addItem(xcondpago.get(i).getDiaspago());
        }

        cboDiasPago.setSelectedIndex(0);
    }

    public void loadTipoPago(String tipo_condicion) {
        try {
            RnTipoPago regla = new RnTipoPago(path);

            if (xmediopago != null) {
                xmediopago.clear();
            } else {
                xmediopago = new ArrayList<BeanTipoPago>();
            }

            xmediopago.addAll(regla.listarTipoPago("", tipo_condicion, "A"));

            cboMedioPago.removeAllItems();
            cboMedioPago.addItem("--- Seleccione Tipo de Pago ---");

            for (int i = 0; i < xmediopago.size(); i++) {
                cboMedioPago.addItem(xmediopago.get(i).getDescripcion());
            }

            cboMedioPago.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void showCambiarCondicion(String id_regconta) {
        setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2), (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 2);
        loadRegister(id_regconta);
        setVisible(true);
    }

    public boolean loadRegister(String id_regconta) {
        try {
            ContaCab m = new ContaCab();
            m.setRcIdregconta(id_regconta);
            m.setFEmision(new Date(1901, 0, 1));
            m.setFInicial(new Date(1901, 0, 1));
            m.setFFinal(new Date(1901, 0, 1));

            RnRegContaCab regla = new RnRegContaCab(path);

            List<ContaCab> reg = regla.listarDocumentosVenta(m);

            if (reg.isEmpty()) {
                return false;
            } else {
                ContaCab regconta = reg.get(0);

                txt_idregconta.setText(regconta.getRcIdregconta());
                txt_documento.setText(regconta.getDocSeriePreimpreso());
                cboCondicionPago.setSelectedItem(regconta.getTipoCondpago().trim().equals("CO") ? "CONTADO" : "CREDITO");
                return true;
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        try {
            if (cboCondicionPago == e.getSource()) {
                if (cboCondicionPago.getItemCount() > 0) {
                    TipoOperacion t = new TipoOperacion();
                    t.setTasa_p(-1);
                    t.setNumero(-1);
                    t.setTasa_d(-1);
                    t.setTasa(-1);
                    t.setId_empresa(usuario.getCodempresa());

                    if (cboCondicionPago.getSelectedIndex() == 0) {
                        cboDiasPago.removeAllItems();
                        cboDiasPago.setEnabled(false);
                        cboMedioPago.removeAllItems();
                        cboMedioPago.setEnabled(false);
                        txt_tipooperacion.setText("");
                    } else {
                        if (cboCondicionPago.getSelectedIndex() == 2) {
                            cboDiasPago.setEnabled(true);
                            cboMedioPago.removeAllItems();
                            cboMedioPago.setEnabled(false);

                            t.setDescripcion("VENTA EN OFICINA CREDITO");
                            RnTipoOperacion regla = new RnTipoOperacion(path);
                            txt_tipooperacion.setText(regla.listarTipoOperacion(t).get(0).getCodigo());
                        } else {
                            cboDiasPago.setEnabled(false);
                            loadTipoPago("C");
                            cboMedioPago.setEnabled(true);
                            if (cboMedioPago.getItemCount() > 0) {
                                cboMedioPago.setSelectedItem("EFECTIVO MN");
                            }

                            t.setDescripcion("VENTA EN OFICINA CONTADO");
                            RnTipoOperacion regla = new RnTipoOperacion(path);
                            txt_tipooperacion.setText(regla.listarTipoOperacion(t).get(0).getCodigo());
                        }

                        loadDiasPago(cboCondicionPago.getSelectedItem().toString().trim().equals("CONTADO") ? "CO" : "CR");

                        if (cboCondicionPago.getSelectedItem().equals("CONTADO")) {
                            cboDiasPago.setSelectedIndex(1);
                        }
                    }
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    @Override
    public void windowGainedFocus(WindowEvent e) {
    }

    @Override
    public void windowLostFocus(WindowEvent e) {
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
    public void keyTyped(KeyEvent e) {
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
    public void propertyChange(PropertyChangeEvent evt) {
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    @Override
    public void focusGained(FocusEvent e) {
    }

    @Override
    public void focusLost(FocusEvent e) {
    }

    @Override
    public void windowOpened(WindowEvent e) {
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
    }
}