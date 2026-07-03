/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.softcommerce.views.uilogin;

import com.softcommerce.comboboxmodel.ComboModelBdEmpresa;
import com.softcommerce.formularios.Main;
import com.softcommerce.formularios.ReadProperties;
import com.softcommerce.fuentes.Fuentes;
import com.softcommerce.general.controles.CPasswordField;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.iconos.Gif;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.LayoutUtil;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.FontFormatException;
import java.awt.GraphicsEnvironment;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.HeadlessException;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JSeparator;
import javax.swing.JTextField;
import javax.swing.WindowConstants;
import org.apache.log4j.Logger;

/**
 *
 * @author Usuario
 */
public class UiLogin extends JDialog implements InterUiLogin,WindowListener, KeyListener, ActionListener, FocusListener, ItemListener  {

    protected final Logger logger = Logger.getLogger(UiLogin.class);
    private static final long serialVersionUID = 1L;
    protected Gif gif;
    protected JTextField txtLogin;
    protected CPasswordField txtPass;
    protected JButton btnAceptar;
    protected JButton btnCancelar;
    protected JComboBox cboEmpresa;
    protected JComboBox cboMultiEmpresa;
    protected ComboModelBdEmpresa cboModelBdEmpresa;
    protected JComboBox cboPuntoVenta;
    protected JLabel lblImagenLogo;
    protected JDateChooser dcFechaInicio;
    protected JDateChooser dcFechaFin;
    protected Date fechaInicio;
    protected Date fechaFin;
    protected Date fechaRegistro;

    public UiLogin(Main frameFather) throws HeadlessException {
        super(frameFather);
        inicialize();
        if (Constans.SWMULTIEMPRESA) {
            loadMultiEmpresa();
        }
        initListener();
    }

    protected void initListener() {
        txtLogin.addKeyListener(this);
        txtLogin.addFocusListener(this);
        txtPass.addKeyListener(this);
        txtPass.addFocusListener(this);
        cboPuntoVenta.addFocusListener(this);
        dcFechaInicio.addFocusListener(this);
        dcFechaFin.addFocusListener(this);
        addWindowListener(this);
        btnAceptar.addKeyListener(this);
        btnAceptar.addActionListener(this);
        btnCancelar.addKeyListener(this);
        btnCancelar.addActionListener(this);
        cboEmpresa.addKeyListener(this);
        cboEmpresa.addActionListener(this);
        cboPuntoVenta.addKeyListener(this);
        ((JTextField) dcFechaInicio.getDateEditor()).addFocusListener(this);
        dcFechaInicio.getJCalendar().addFocusListener(this);
        dcFechaInicio.getJCalendar().addKeyListener(this);
        dcFechaInicio.getCalendarButton().addActionListener(this);
        dcFechaInicio.addKeyListener(this);
        ((JTextField) dcFechaFin.getDateEditor()).addFocusListener(this);
        dcFechaFin.getJCalendar().addFocusListener(this);
        dcFechaFin.getJCalendar().addKeyListener(this);
        dcFechaFin.getCalendarButton().addActionListener(this);
        dcFechaFin.addKeyListener(this);
        ((JTextField) dcFechaInicio.getDateEditor()).addKeyListener(this);
        ((JTextField) dcFechaFin.getDateEditor()).addKeyListener(this);
    }

    protected void getCalendarioBoton(JDateChooser jdateChooser) {
        jdateChooser.getCalendarButton().doClick();
    }

    protected JPanel getPnlAccess() {
        JPanel pnlAccess = new JPanel();
        pnlAccess.setLayout(new BorderLayout());
        Color color = new Color(238, 238, 238);
        pnlAccess.setBackground(color);
        JLabel lblImagenSeguridad = new JLabel(gif.CANDADO);
        pnlAccess.add(lblImagenSeguridad, BorderLayout.WEST);
        GridBagConstraints gbc = LayoutUtil.getGbc();
        gbc.insets = new Insets(5, 5, 5, 5);
        gbc.fill = GridBagConstraints.BOTH;
        JPanel pnlData = new JPanel(new GridBagLayout());
        pnlData.setBackground(color);
        pnlAccess.add(pnlData, BorderLayout.CENTER);
        if (Constans.SWMULTIEMPRESA) {
            JLabel lblMultiEmpresa = new JLabel("Empresa");
            lblMultiEmpresa.setFont(new Font("Verdana", 1, 12));
            pnlData.add(lblMultiEmpresa, gbc);
            gbc.gridx = 1;
            cboMultiEmpresa = new JComboBox();
            cboMultiEmpresa.addItemListener(this);
            cboMultiEmpresa.addKeyListener(this);
            pnlData.add(cboMultiEmpresa, gbc);
        }
        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblLogin = new JLabel("Usuario");
        lblLogin.setFont(new Font("Verdana", 1, 12));
        pnlData.add(lblLogin, gbc);
        gbc.gridx = 1;
        txtLogin = new JTextField();
        txtLogin.setColumns(12);
        txtLogin.setFont(new Font("Verdana", 0, 12));
        txtLogin.setText("");
        pnlData.add(txtLogin, gbc);
        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblPass = new JLabel("Contraseña");
        lblPass.setFont(new Font("Verdana", 1, 12));
        pnlData.add(lblPass, gbc);
        gbc.gridx = 1;
        txtPass = new CPasswordField(20);
        txtPass.setEchoChar('•');
        txtPass.setText("");
        txtPass.setColumns(12);
        txtPass.setFont(new Font("Verdana", 0, 12));
        pnlData.add(txtPass, gbc);
        JSeparator jsep = new JSeparator();
        pnlAccess.add(jsep, BorderLayout.SOUTH);
        return pnlAccess;
    }

    @SuppressWarnings("deprecation")
    protected void inicialize() {
        try {
            Fuentes font = new Fuentes();
            GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
            ge.registerFont(Font.createFont(Font.TRUETYPE_FONT, font.getFuenteMacross()));
            System.out.println(Arrays.asList(GraphicsEnvironment.getLocalGraphicsEnvironment().getAvailableFontFamilyNames()));
        } catch (FontFormatException | IOException ex) {
            ExceptionHandler.handleException(ex, logger);
        }
        gif = new Gif();
        JPanel pnlSesion = new JPanel();
        pnlSesion.setLayout(new BorderLayout());
        pnlSesion.setBackground(Color.WHITE);
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.setBackground(new Color(238, 238, 238));
        pnl.add(this.getPnlAccess(), BorderLayout.CENTER);
        pnl.add(getPnlSouth(), BorderLayout.SOUTH);
        this.setFechas();
        pnlSesion.add(pnl, BorderLayout.CENTER);
        pnlSesion.add(this.getPnlLogo(), BorderLayout.NORTH);
        setDefaultCloseOperation(WindowConstants.DISPOSE_ON_CLOSE);
        setSize(new Dimension(550, 545));
        setResizable(false);
        setContentPane(pnlSesion);
        setModal(true);
        ComponentToolKit.centerComponentPosicion(this);
    }

    protected JPanel getPnlLogo() {
        JPanel pnlLogo = new JPanel(new BorderLayout());
        lblImagenLogo = new JLabel();
        pnlLogo.add(lblImagenLogo);
        return pnlLogo;
    }

    protected JPanel getPnlSouth() {
        JPanel pnl = new JPanel(new BorderLayout());
        pnl.add(this.getPnlDataEmpresa(), BorderLayout.NORTH);
        JSeparator jsep = new JSeparator();
        pnl.add(jsep, BorderLayout.CENTER);
        pnl.add(this.getPnlButton(), BorderLayout.SOUTH);
        return pnl;
    }

    protected JPanel getPnlButton() {
        JPanel pnlPrinc = new JPanel(new BorderLayout());
        JPanel pnlButtons = new JPanel(new FlowLayout(FlowLayout.LEADING, 10, 5));
        pnlPrinc.add(pnlButtons, BorderLayout.EAST);
        pnlButtons.setBackground(new Color(238, 238, 238));
        pnlPrinc.setBackground(new Color(238, 238, 238));
        btnAceptar = new JButton("Iniciar sesión");
        btnAceptar.setMnemonic('I');
        btnAceptar.setEnabled(false);
        btnAceptar.setMargin(new Insets(10, 10, 10, 10));
        pnlButtons.add(btnAceptar);
        btnCancelar = new JButton("Cancelar");
        pnlButtons.add(btnCancelar);
        return pnlPrinc;
    }

    protected JPanel getPnlDataEmpresa() {
        JPanel pnlPrinc = new JPanel(new BorderLayout());
        JPanel pnlAccess = new JPanel(new GridBagLayout());
        pnlPrinc.add(pnlAccess, BorderLayout.WEST);
        GridBagConstraints gbc = LayoutUtil.getGbc();
        gbc.insets = new Insets(5, 10, 5, 10);
        pnlAccess.setBackground(new Color(238, 238, 238));
        pnlPrinc.setBackground(new Color(238, 238, 238));
        JLabel lblEmpresa = new JLabel("Empresa");
        if (!Constans.SWMULTIEMPRESA) {
            pnlAccess.add(lblEmpresa, gbc);
        }
        cboEmpresa = new JComboBox();
        cboEmpresa.setEnabled(false);
        gbc.gridx = 1;
        if (!Constans.SWMULTIEMPRESA) {
            pnlAccess.add(cboEmpresa, gbc);
        }
        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblPuntoVenta = new JLabel("Sucursal");
        pnlAccess.add(lblPuntoVenta, gbc);
        gbc.gridx = 1;
        cboPuntoVenta = new JComboBox();
        cboPuntoVenta.setEnabled(false);
        pnlAccess.add(cboPuntoVenta, gbc);
        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblFechaInicio = new JLabel("Fecha Inicio");
        lblFechaInicio.setDisplayedMnemonic('c');
        pnlAccess.add(lblFechaInicio, gbc);
        gbc.gridx = 1;
        dcFechaInicio = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        pnlAccess.add(dcFechaInicio, gbc);
        gbc.gridx = 0;
        gbc.gridy = 3;
        JLabel lblFechaFin = new JLabel("Fecha Fin");
        lblFechaFin.setDisplayedMnemonic('a');
        pnlAccess.add(lblFechaFin, gbc);
        gbc.gridx = 1;
        dcFechaFin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        pnlAccess.add(dcFechaFin, gbc);
        return pnlPrinc;
    }
    
    @Override
    public void initAutomatico() {
    }
    
    @Override
    public void setProperties(ReadProperties r) {
    }

    protected void setFechas() {
        try {
            @SuppressWarnings("deprecation")
            java.sql.Date fechaServer = this.getFechaServer();
            Date dateIni = new Date(fechaServer.getTime());
            SimpleDateFormat formatDate = new SimpleDateFormat("MM/yyyy");
            String ini = formatDate.format(dateIni);
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
            dateIni = sdf.parse("01/" + ini);
            Main.fechaActualServer = fechaServer;
            fechaInicio = dateIni;
            fechaFin = new Date(fechaServer.getTime());
            dcFechaInicio.setDate(fechaInicio);
            dcFechaFin.setDate(fechaFin);
        } catch (ClassNotFoundException | InstantiationException | IllegalAccessException ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }
    
    @Override
    public java.sql.Date getFechaServer() throws InstantiationException, IllegalAccessException, Exception {
        return new java.sql.Date((new java.util.Date()).getTime());
    }

    @SuppressWarnings("ReturnOfDateField")
    public Date getFechaInicio() {
        return fechaInicio;
    }

    @SuppressWarnings("ReturnOfDateField")
    public Date getFechaRegistro() {
        return fechaRegistro;
    }

    @SuppressWarnings("ReturnOfDateField")
    public Date getFechaFin() {
        return fechaFin;
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txtLogin) {
            txtLogin.selectAll();
        }
        if (e.getSource() == txtPass) {
            this.estaEnPass();
        }
    }    

    @Override
    public void windowClosing(WindowEvent e) {
        closeSystem();
    }

    @Override
    @SuppressWarnings("deprecation")
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == dcFechaInicio.getCalendarButton()) {
            dcFechaInicio.setSelectableDateRange(new Date(100, 0, 1), dcFechaFin.getDate());
        }

        if (e.getSource() == dcFechaFin.getCalendarButton()) {
            dcFechaFin.setSelectableDateRange(dcFechaInicio.getDate(), dcFechaFin.getMaxSelectableDate());
        }

        if (btnCancelar == e.getSource()) {
            this.closeSystem();
        }

        if (cboEmpresa == e.getSource()) {
            loadSucursales();
        }

        if (btnAceptar == e.getSource()) {
            initSession();
        }
    }

    public void setFecha(String fecha) {
        String nuevafecha = (fecha.length() == 6) ? ("0" + fecha) : fecha;
        Calendar calendar = Calendar.getInstance();
        calendar.set(Integer.valueOf(nuevafecha.substring(3, 7)), (Integer.valueOf(nuevafecha.substring(0, 2)) - 1), 1);
        fechaInicio = DateTime.getDateFecha("01/" + nuevafecha);
        fechaFin = DateTime.getDateFecha(String.valueOf(calendar.getActualMaximum(Calendar.DAY_OF_MONTH)) + "/" + nuevafecha);
    }

    @Override
    public void loguear() {
    }
    
    @Override
    public void initSession() {        
    }
             
    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            this.closeSystem();
        }

        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txtLogin) {
                txtPass.requestFocus();
            }

            if (e.getSource() == txtPass) {
                loguear();
            }
        }
    }

    public void setEnabledSession(boolean e) {
        cboPuntoVenta.setEnabled(e);
        cboEmpresa.setEnabled(e);
        btnAceptar.setEnabled(e);
    }
    
    @Override
    public boolean validarFecha() {        
        return false;
    }

    @Override
    @SuppressWarnings("deprecation")
    public boolean verificarLogin() {
        return false;
    }

    @Override
    public void cargarEmpresa() {
    }
    
    @Override
    public boolean showSessionDialog() {
        return false;
    }

    @Override
    public void windowOpened(WindowEvent e) {
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
    public void keyReleased(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ENTER) {
            if (e.getSource().equals(((JTextField) dcFechaInicio.getDateEditor()))) {
                ((JTextFieldDateEditor) dcFechaFin.getDateEditor()).requestFocus();
            } else if (e.getSource().equals(((JTextField) dcFechaFin.getDateEditor()))) {
                btnAceptar.requestFocusInWindow();
            } else if (e.getSource().equals((JComboBox) cboMultiEmpresa)) {
                txtLogin.requestFocusInWindow();
            } else if (e.getSource().equals((JComboBox) cboPuntoVenta)) {
                seleccionePuntoVenta();
            } else if (e.getSource().equals((JTextField) txtLogin)) {
                txtPass.requestFocusInWindow();
            }
        } else if (e.getKeyCode() == KeyEvent.VK_SPACE) {
            if (e.getSource().equals(((JTextField) dcFechaInicio.getDateEditor()))) {
                getCalendarioBoton(dcFechaInicio);
            } else if (e.getSource().equals(((JTextField) dcFechaFin.getDateEditor()))) {
                getCalendarioBoton(dcFechaFin);
            }
        }
    }

    @Override
    public void focusLost(FocusEvent e) {

    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        if (e.getSource().equals(cboMultiEmpresa)) {
            loadConexionEmpresa();
        }
    }

    @Override
    public void loadMultiEmpresa() {
    }

    @Override
    public void loadConexionEmpresa() {
    }

    @Override
    public void closeSystem() {
    }

    @Override
    public void seleccionePuntoVenta() {
    }
    
    @Override
    public void estaEnPass(){
        txtPass.selectAll();
    }

    @Override
    public void loadSucursales() {
    }
}
