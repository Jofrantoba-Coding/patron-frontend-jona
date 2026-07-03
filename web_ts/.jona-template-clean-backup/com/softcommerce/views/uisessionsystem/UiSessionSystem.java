package com.softcommerce.views.uisessionsystem;

import com.softcommerce.formularios.*;
import java.awt.HeadlessException;
/*
import com.softcommerce.accesoDatos.DAOGeneral;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioAUD;
import com.softcommerce.comboboxmodel.ComboModelBdEmpresa;
import com.softcommerce.entity.BdEmpresa;
import com.softcommerce.entity.BdEmpresaParametro;
import com.softcommerce.entity.BdEmpresaReport;
import com.softcommerce.enums.ParametroEmpresaEnum;
import com.softcommerce.fuentes.Fuentes;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import com.softcommerce.general.controles.CPasswordField;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.iconos.Gif;
import com.softcommerce.logic.LogicBdEmpresa;
import com.softcommerce.logic.LogicConfiguracion;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.HeadlessException;
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
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JSeparator;
import javax.swing.JTextField;
import javax.swing.WindowConstants;
import javax.swing.border.LineBorder;
import java.net.InetAddress;
import com.softcommerce.util.Propiedad;
import java.util.GregorianCalendar;
import com.softcommerce.reglasnegocio.RnUsuario;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.LayoutUtil;
import com.softcommerce.util.Util;
import java.awt.FlowLayout;
import java.awt.FontFormatException;
import java.awt.GraphicsEnvironment;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.net.URL;
import org.apache.log4j.Logger;

@SuppressWarnings("MultipleTopLevelClassesInFile")*/
public class UiSessionSystem
        /*extends JDialog
        implements InterUiSessionSystem, WindowListener, KeyListener, ActionListener, FocusListener, ItemListener */{

        public UiSessionSystem(Main arg0) throws HeadlessException {
    }

    /*private final Logger logger = Logger.getLogger(UiSessionSystem.class);

    private static final long serialVersionUID = 1L;
    protected final Main frmsys;
    protected Usuario usuario;
    protected Gif gif;
    protected JTextField txtLogin;
    protected CPasswordField txtPass;
    protected JButton btnAceptar;
    protected JButton btnCancelar;
    protected JComboBox cboEmpresa;
    protected JComboBox cboMultiEmpresa;
    protected ComboModelBdEmpresa cboModelBdEmpresa;
    protected JComboBox cboPuntoVenta;
    protected String pass_se;
    protected String pass_ce;
    protected JLabel lblImagenLogo;
    public static List<Usuario> usuariosConAcceso = new ArrayList<Usuario>(10);
    protected boolean bandera = false;
    protected JDateChooser dcFechaInicio;
    protected JDateChooser dcFechaFin;
    protected Date fechaInicio;
    protected Date fechaFin;
    protected Date fechaRegistro;
    protected URL path;
    protected int estaEnPass;
    protected int saleDeSede = 0;

    public UiSessionSystem(Main arg0) throws HeadlessException {
        super(arg0);
        frmsys = arg0;
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
        //cboPuntoVenta.addActionListener(this);
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

    protected void loadConexionEmpresa() {
        BdEmpresa bean = cboModelBdEmpresa.getElement(cboMultiEmpresa.getSelectedIndex());
        DAOGeneral.URLCONEXION = "jdbc:oracle:thin:@//" + bean.getIpHost() + ":" + bean.getPuerto() + "/" + bean.getSchema(); //NAMESERVICE                
        DAOGeneral.USUARIO = bean.getUserPrincipal();
        DAOGeneral.CLAVE = bean.getClavePrincipal();
        Main.strLogo = bean.getLogoDesktopJava();
    }

    protected void loadMultiEmpresa() {
        Propiedad p = new Propiedad();

        LogicBdEmpresa logic = new LogicBdEmpresa(p.getDbSys());
        cboModelBdEmpresa = new ComboModelBdEmpresa(logic.listarBdEmpresa());
        cboMultiEmpresa.setModel(cboModelBdEmpresa);
        if (!cboModelBdEmpresa.getData().isEmpty()) {
            cboMultiEmpresa.setSelectedIndex(0);
        }
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
            //cboMultiEmpresa.setPreferredSize(new Dimension(300,0));
            pnlData.add(cboMultiEmpresa, gbc);
        }
        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblLogin = new JLabel("Usuario");
        lblLogin.setFont(new Font("Verdana", 1, 12));
        pnlData.add(lblLogin, gbc);

        gbc.gridx = 1;
        //gbc.fill=GridBagConstraints.BOTH;
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

    protected void initAutomatico() {
        txtLogin.setText("admin");
        txtPass.setText("admin");
        loguear();
    }

    public void setProperties(ReadProperties r) {
        setTitle(r.TITULO_LOGIN);
        lblImagenLogo.setIcon(r.LOGO);
        lblImagenLogo.setBounds(0, 0, r.LOGO.getIconWidth(), r.LOGO.getIconHeight());
        this.path = r.PATH;
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

    protected java.sql.Date getFechaServer() throws InstantiationException, IllegalAccessException, Exception {
        Propiedad p = new Propiedad();
        java.sql.Date fechaServer = (new LogicConfiguracion(p.getDbSys())).fechaServer();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date(fechaServer.getTime()));
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date newDate = calendar.getTime();
        java.sql.Date test = new java.sql.Date(newDate.getTime());
        return test;
    }

    public Usuario getRegistroUsuario() {
        return usuario;
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
            txtPass.selectAll();
            estaEnPass = 1;
        }

    }

    @Override
    public void windowClosing(WindowEvent e) {
        bandera = false;
        dispose();
        frmsys.dispose();
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
            bandera = false;
            dispose();
            frmsys.dispose();
        }

        if (cboEmpresa == e.getSource()) {
            if (cboEmpresa.getItemCount() > 0) {
                cboPuntoVenta.removeAllItems();
                cboPuntoVenta.setEnabled(true);
                for (int i = 0; i < usuariosConAcceso.size(); i++) {
                    if (usuariosConAcceso.get(i).getDescriempresa().trim().equals(cboEmpresa.getSelectedItem())) {
                        cboPuntoVenta.addItem(usuariosConAcceso.get(i).getDescripuntoventa());
                    }
                }
                if (cboPuntoVenta.getItemCount() > 0) {
                    cboPuntoVenta.setSelectedIndex(0);
                }
            }
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

    protected void loguear() {
        usuariosConAcceso.clear();
        cboPuntoVenta.removeAllItems();
        cboEmpresa.removeAllItems();
        setEnabledSession(false);
        if (verificarLogin()) {
            cargarEmpresa();
            cboPuntoVenta.requestFocusInWindow();
        }
    }

    protected void initSession() {
        for (int i = 0; i < usuariosConAcceso.size(); i++) {
            if (usuariosConAcceso.get(i).getDescriempresa().equals(cboEmpresa.getSelectedItem().toString()) && usuariosConAcceso.get(i).getDescripuntoventa().equals(cboPuntoVenta.getSelectedItem().toString())) {
                usuario = usuariosConAcceso.get(i);
                UsuarioAUD.CODIGO_PTOVENTA = usuariosConAcceso.get(i).getCodpuntoventa();
                break;
            }
        }

        usuario.setPass_ce(pass_ce);
        usuario.setPass_se(pass_se);

        if (validarFecha()) {
            fechaInicio = dcFechaInicio.getDate();
            fechaFin = dcFechaFin.getDate();
            java.sql.Date ini = new java.sql.Date(dcFechaInicio.getDate().getTime());
            Calendar calendarIni = new GregorianCalendar();
            calendarIni.setTime(ini);
            String annoInicio = String.valueOf(calendarIni.get(Calendar.YEAR));
            frmsys.setAnio(annoInicio);
            frmsys.setFechas(fechaInicio, fechaFin);
            this.setDataEmpresaConstans();
            bandera = true;
            setVisible(false);
            frmsys.setVisible(true);
        }
    }

    protected void setDataEmpresaConstans() {
        try {
            String userEmpresa;
            if (Constans.SWMULTIEMPRESA) {
                userEmpresa = DAOGeneral.USUARIO;
            } else {
                ReadProperties r = ReadProperties.Instance(path);
                userEmpresa = r.USERNAME;
            }
            this.setDataEmpresa(userEmpresa);
            this.setPathRepors(userEmpresa);
            this.setDataParametrosEmpresa(userEmpresa);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
        }
    }

    protected void setDataEmpresa(String userEmpresa)
            throws Exception {
        try {
            RnUsuario logiUser = new RnUsuario(this.path);
            BdEmpresa beanEmpresa = logiUser.getBeanEmpresa(userEmpresa);
            if (beanEmpresa == null) {
                throw new Exception("Usuario no esta configurado en supergoadmin");
            }
            //Constans.SWCODEBARRA = beanEmpresa.getFlag_code_barra() == 1;
            Constans.SWCONVERSION = beanEmpresa.getFlag_conversion().equalsIgnoreCase("1");
            //Constans.SWDESPACHO = beanEmpresa.getFlag_despacho() == 1;
            Constans.ISBOTICA = beanEmpresa.getIsBotica() == 1;
        } catch (Exception e) {
            throw e;
        }
    }

    protected void setDataParametrosEmpresa(String userEmpresa) throws Exception {
        try {
            RnUsuario logiUser = new RnUsuario(this.path);
            List<BdEmpresaParametro> listParametros = logiUser.listEmpresaParametro(userEmpresa);
            if (listParametros.isEmpty()) {
                logger.warn("Lista de Parametros Empresa Vacia");
                return;
            }
            Constans.SWDESPACHO = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.DESPACHO_AUTOMATICO, Constans.SWDESPACHO, "SWDESPACHO");
            Constans.SWCODEBARRA = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.CODIGO_BARRA, Constans.SWCODEBARRA, "SWCODEBARRA");
            Constans.SWPEDIDO = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.PEDIDO, Constans.SWPEDIDO, "SWPEDIDO");
            Constans.IS_EDIT_MONTO_VENTA = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.EDIT_MONTO_VENTA_ITEM, Constans.IS_EDIT_MONTO_VENTA, "IS_EDIT_MONTO_VENTA");
            Constans.TIPO_VENTA = this.getParametroInteger(listParametros, ParametroEmpresaEnum.TIPO_VENTA, Constans.TIPO_VENTA, "TIPO_VENTA");
            Constans.IS_ITEM_RESUMEN = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.ITEM_RESUMEN, Constans.IS_ITEM_RESUMEN, "IS_ITEM_RESUMEN");
            Constans.IS_ITEM_RESUMEN_PRECIO = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.ITEM_RESUMEN_PRECIO, Constans.IS_ITEM_RESUMEN_PRECIO, "IS_ITEM_RESUMEN_PRECIO");
            Constans.ISBOLETACONTINUA = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.BOLETA_CONTINUA, Constans.ISBOLETACONTINUA, "ISBOLETACONTINUA");
            Constans.ISFACTURACONTINUA = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.FACTURA_CONTINUA, Constans.ISFACTURACONTINUA, "ISFACTURACONTINUA");
            Constans.ISMULTIVENTA = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.MULTI_VENTA, Constans.ISMULTIVENTA, "ISMULTIVENTA");
            Constans.DIG_SERIE = this.getParametroInteger(listParametros, ParametroEmpresaEnum.DIG_SERIE, Constans.DIG_SERIE, "DIG_SERIE");
            Constans.DIG_PREIMPRESO = this.getParametroInteger(listParametros, ParametroEmpresaEnum.DIG_PREIMPRESO, Constans.DIG_PREIMPRESO, "DIG_PREIMPRESO");
            Constans.ISPG = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.PUBLICO_GENERAL, Constans.ISPG, "ISPG");
            Constans.ISCOTIZACIONEDIT = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.EDITAR_COTIZACION, Constans.ISCOTIZACIONEDIT, "ISCOTIZACIONEDIT");
            Constans.IS_COSTO_COMPRA_ITEM = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.SHOW_COSTO_COMPRA_ITEM, Constans.IS_COSTO_COMPRA_ITEM, "IS_COSTO_COMPRA_ITEM");
            Constans.ISIMPRESIONVENTA = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.IS_IMPRESION_VENTA, Constans.ISIMPRESIONVENTA, "ISIMPRESIONVENTA");
            Constans.IS_ITEM_BY_CLIENTE = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.IS_ITEM_BY_CLIENTE, Constans.IS_ITEM_BY_CLIENTE, "IS_ITEM_BY_CLIENTE");
            Constans.IS_ITEM_BY_CLIENTE_COLOR = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.IS_ITEM_BY_CLIENTE_COLOR, Constans.IS_ITEM_BY_CLIENTE_COLOR, "IS_ITEM_BY_CLIENTE_COLOR");
            Constans.IS_PRECIO_INCLUYEIGV = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.IS_PRECIO_INCLUYEIGV, Constans.IS_PRECIO_INCLUYEIGV, "IS_PRECIO_INCLUYEIGV");
            Constans.IS_DIRECCION_CLIENTE = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.IS_DIRECCION_CLIENTE, Constans.IS_DIRECCION_CLIENTE, "IS_DIRECCION_CLIENTE");
            Constans.IS_LOTE_RESERVA = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.IS_LOTE_RESERVA, Constans.IS_LOTE_RESERVA, "IS_LOTE_RESERVA");
            Constans.IS_CLIENTE_CONDICION_PAGO = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.IS_CLIENTE_CONDICION_PAGO, Constans.IS_CLIENTE_CONDICION_PAGO, "IS_CLIENTE_CONDICION_PAGO");
            Constans.IS_ADICIONALES_VENTA = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.IS_ADICIONALES_VENTA, Constans.IS_ADICIONALES_VENTA, "IS_ADICIONALES_VENTA");
            Constans.IS_CLIENTE_SUSTITUTO = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.IS_CLIENTE_SUSTITUTO, Constans.IS_CLIENTE_SUSTITUTO, "IS_CLIENTE_SUSTITUTO");
            Constans.ES_OBLIGATORIO_UBICACION = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.ES_OBLIGATORIO_UBICACION, Constans.ES_OBLIGATORIO_UBICACION, "ES_OBLIGATORIO_UBICACION");
            Constans.IS_BUSQUEDA_ITEM_ALTERNO = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.IS_BUSQUEDA_ITEM_ALTERNO, Constans.IS_BUSQUEDA_ITEM_ALTERNO, "IS_BUSQUEDA_ITEM_ALTERNO");
            Constans.IS_FACTURADOR_SUNAT = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.IS_FACTURADOR_SUNAT, Constans.IS_FACTURADOR_SUNAT, "IS_FACTURADOR_SUNAT");
            Constans.IS_EDIT_DESCRIPCION_ITEM_VENTA = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.IS_EDIT_DESCRIPCION_ITEM_VENTA, Constans.IS_EDIT_DESCRIPCION_ITEM_VENTA, "IS_EDIT_DESCRIPCION_ITEM_VENTA");
            Constans.IS_AUTORIZAR_PRECIO = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.IS_AUTORIZAR_PRECIO, Constans.IS_AUTORIZAR_PRECIO, "IS_AUTORIZAR_PRECIO");
            Constans.IS_VALIDATE_MONTO_VENTA = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.IS_VALIDATE_MONTO_VENTA, Constans.IS_VALIDATE_MONTO_VENTA, "IS_VALIDATE_MONTO_VENTA");
            Constans.IS_CORRELATIVO_LIQ_VENTA = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.IS_CORRELATIVO_LIQ_VENTA, Constans.IS_CORRELATIVO_LIQ_VENTA, "IS_CORRELATIVO_LIQ_VENTA");
            Constans.IS_SEARCH_CLASE_PRECIO = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.IS_SEARCH_CLASE_PRECIO, Constans.IS_SEARCH_CLASE_PRECIO, "IS_SEARCH_CLASE_PRECIO");
            Constans.IS_HORA_IMPRESION_VENTA = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.IS_HORA_IMPRESION_VENTA, Constans.IS_HORA_IMPRESION_VENTA, "IS_HORA_IMPRESION_VENTA");
            Constans.IS_ITEM_DESTINO_MULTIPLE = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.IS_ITEM_DESTINO_MULTIPLE, Constans.IS_ITEM_DESTINO_MULTIPLE, "IS_ITEM_DESTINO_MULTIPLE");
            Constans.IS_BOTICA_SIN_LOTE = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.IS_BOTICA_SIN_LOTE, Constans.IS_BOTICA_SIN_LOTE, "IS_BOTICA_SIN_LOTE");
            Constans.IS_ER = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.IS_ER, Constans.IS_ER, "IS_ER");
            Constans.IS_CONECTION_UNIQUE = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.IS_CONECTION_UNIQUE, Constans.IS_CONECTION_UNIQUE, "IS_CONECTION_UNIQUE");
            Constans.ISALLBOLETAPG = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.ISALLBOLETAPG, Constans.ISALLBOLETAPG, "ISALLBOLETAPG");
            Constans.IS_RETENCION_VENTA_CLIENTE = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.IS_RETENCION_VENTA_CLIENTE, Constans.IS_RETENCION_VENTA_CLIENTE, "IS_RETENCION_VENTA_CLIENTE");
            //Constans.IS_COMA_SEPARADOR_DECIMAL = this.getParametroBoolean(listParametros, ParametroEmpresaEnum.IS_COMA_SEPARADOR_DECIMAL);
        } catch (Exception e) {
            throw e;
        }
    }

    protected Boolean getParametroBoolean(List<BdEmpresaParametro> listParametros, ParametroEmpresaEnum paramEmpEnum, Object constante, String nombreConstante) {
        //boolean paramExist = false;
        for (BdEmpresaParametro parametro : listParametros) {
            if (parametro.getDescripcion().equals(paramEmpEnum.name())) {
                logger.debug("Parametro " + paramEmpEnum.name() + ": " + parametro.getValor());
                return parametro.getValor() == 1;
            }
        }
        Object val = Constans.valueConstants(nombreConstante, constante);
        logger.debug("Parametro " + paramEmpEnum.name() + ": " + val);
        if (val != null) {
            return (Boolean) val;
        }
        return false;
    }

    protected Integer getParametroInteger(List<BdEmpresaParametro> listParametros, ParametroEmpresaEnum paramEmpEnum, Object constante, String nombreConstante) {
        boolean paramExist = false;
        for (BdEmpresaParametro parametro : listParametros) {
            if (parametro.getDescripcion().equals(paramEmpEnum.name())) {
                return parametro.getValor();
            }
        }
        if (!paramExist) {
            Object val = Constans.valueConstants(nombreConstante, constante);
            if (val != null) {
                return (Integer) val;
            } else {
                return 0;
            }
        }
        return 0;
    }

    protected void setPathRepors(String userEmpresa)
            throws Exception {
        try {
            RnUsuario logiUser = new RnUsuario(this.path);
            List<BdEmpresaReport> listreports = logiUser.listEmpresaReport(userEmpresa);
            String pathReport = this.getPathReport(listreports, "BOLETA");
            if (pathReport != null) {
                Constans.PATH_RPT_BOLETA = pathReport;
            }
            pathReport = this.getPathReport(listreports, "FACTURA");
            if (pathReport != null) {
                Constans.PATH_RPT_FACTUTA = pathReport;
            }
            pathReport = this.getPathReport(listreports, "GUIA");
            if (pathReport != null) {
                Constans.PATH_RPT_GUIA = pathReport;
            }

            pathReport = this.getPathReport(listreports, "NOTACREDITO");
            if (pathReport != null) {
                Constans.PATH_RPT_NOTACREDITO = pathReport;
            }

            pathReport = this.getPathReport(listreports, "ORDENRECOJO");
            if (pathReport != null) {
                Constans.PATH_RPT_DESPACHO = pathReport;
            }

            pathReport = this.getPathReport(listreports, "SUBORDENRECOJO");
            if (pathReport != null) {
                Constans.PATH_SUB_RPT_DESPACHO = pathReport;
            }

            pathReport = this.getPathReport(listreports, "NOTADEBITO");
            if (pathReport != null) {
                Constans.PATH_RPT_NOTADEBITO = pathReport;
            }

            pathReport = this.getPathReport(listreports, "SUBNOTADEBITO");
            if (pathReport != null) {
                Constans.PATH_SUB_RPT_NOTADEBITO = pathReport;
            }

            pathReport = this.getPathReport(listreports, "NOTADEBITODIFERENCIA");
            if (pathReport != null) {
                Constans.PATH_RPT_NOTADEBITODIFERENCIA = pathReport;
            }

            pathReport = this.getPathReport(listreports, "SUBNOTADEBITODIFERENCIA");
            if (pathReport != null) {
                Constans.PATH_SUB_RPT_NOTADEBITODIFERENCIA = pathReport;
            }
            pathReport = this.getPathReport(listreports, "COTIZACION");
            if (pathReport != null) {
                Constans.PATH_RPT_COTIZACION = pathReport;
            }
            pathReport = this.getPathReport(listreports, "TICKET");
            if (pathReport != null) {
                Constans.PATH_RPT_TICKET = pathReport;
            }
            pathReport = this.getPathReport(listreports, "LOGOVENTA");
            if (pathReport != null) {
                Constans.PATH_LOGO_VENTA = pathReport;
            }

        } catch (Exception e) {
            throw e;
        }
    }

    protected String getPathReport(List<BdEmpresaReport> listreports, String nameReport) {
        for (BdEmpresaReport report : listreports) {
            if (report.getReport().equals(nameReport)) {
                return report.getPath_report();
            }
        }
        return null;
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            bandera = false;
            dispose();
            frmsys.dispose();
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

    public boolean validarFecha() {
        try {
            ((JTextFieldDateEditor) dcFechaInicio.getDateEditor()).setBorder(((JTextFieldDateEditor) new JDateChooser().getDateEditor()).getBorder());
            ((JTextFieldDateEditor) dcFechaFin.getDateEditor()).setBorder(((JTextFieldDateEditor) new JDateChooser().getDateEditor()).getBorder());

            if (((JTextFieldDateEditor) dcFechaInicio.getDateEditor()).getText().equals("__/__/____")
                    || !DateTime.isValidDate(((JTextFieldDateEditor) dcFechaInicio.getDateEditor()).getText().replace("_", "0"))) {
                JOptionPane.showMessageDialog(this, "La fecha de Inicio que has especificado no es válida. Compruébala e inténtalo de nuevo.", "Cambiar Fecha", JOptionPane.INFORMATION_MESSAGE);
                ((JTextFieldDateEditor) dcFechaInicio.getDateEditor()).setBorder(new LineBorder(Color.RED));
                ((JTextFieldDateEditor) dcFechaInicio.getDateEditor()).requestFocus();

                return false;
            }

            if (((JTextFieldDateEditor) dcFechaFin.getDateEditor()).getText().equals("__/__/____")
                    || !DateTime.isValidDate(((JTextFieldDateEditor) dcFechaFin.getDateEditor()).getText().replace("_", "0"))) {
                JOptionPane.showMessageDialog(this, "La fecha de Fin que has especificado no es válida. Compruébala e inténtalo de nuevo.", "Cambiar Fecha", JOptionPane.INFORMATION_MESSAGE);
                ((JTextFieldDateEditor) dcFechaFin.getDateEditor()).setBorder(new LineBorder(Color.RED));
                ((JTextFieldDateEditor) dcFechaFin.getDateEditor()).requestFocus();

                return false;
            }

            if (DateTime.diferenciasDeFechas(Funciones.getParametro("INICIO_ACTIVIDADES", usuario.getCodempresa(), path), ((JTextFieldDateEditor) dcFechaInicio.getDateEditor()).getText()) < 0) {
                JOptionPane.showMessageDialog(this, "La fecha de inicio de actividades es mayor a la fecha de inicio que has especificado. Compruébala e inténtalo de nuevo.", "Cambiar Fecha", JOptionPane.INFORMATION_MESSAGE);
                ((JTextFieldDateEditor) dcFechaInicio.getDateEditor()).setBorder(new LineBorder(Color.RED));
                ((JTextFieldDateEditor) dcFechaInicio.getDateEditor()).requestFocus();

                return false;
            }

            if (DateTime.diferenciasDeFechas(((JTextFieldDateEditor) dcFechaInicio.getDateEditor()).getText(), ((JTextFieldDateEditor) dcFechaFin.getDateEditor()).getText()) < 0) {
                JOptionPane.showMessageDialog(this, "La fecha de fin es menor a la Fecha de inicio que has especificado. Compruébala e inténtalo de nuevo.", "Cambiar Fecha", JOptionPane.INFORMATION_MESSAGE);
                ((JTextFieldDateEditor) dcFechaFin.getDateEditor()).setBorder(new LineBorder(Color.RED));
                ((JTextFieldDateEditor) dcFechaFin.getDateEditor()).requestFocus();

                return false;
            }

            
            java.sql.Date ini = new java.sql.Date(dcFechaInicio.getDate().getTime());
            java.sql.Date fin = new java.sql.Date(dcFechaFin.getDate().getTime());
            Calendar calendarIni = new GregorianCalendar();
            Calendar calendarFin = new GregorianCalendar();
            calendarIni.setTime(ini);
            calendarFin.setTime(fin);
            String annoInicio = String.valueOf(calendarIni.get(Calendar.YEAR));
            String annoFin = String.valueOf(calendarFin.get(Calendar.YEAR));
            if (!annoInicio.equalsIgnoreCase(annoFin)) {
                JOptionPane.showMessageDialog(this, "Las fechas Inicio y Fin deben estar en el mismo año contable.", "Año Contable", JOptionPane.INFORMATION_MESSAGE);
                return false;
            }

            return true;
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    @SuppressWarnings("deprecation")
    public boolean verificarLogin() {
        try {
            pass_se = txtPass.getText().trim();
            RnUsuario regla = new RnUsuario(path);
            List<Usuario> data = new ArrayList(10);

            if (!Util.isBlank(txtLogin.getText()) && !Util.isBlank(txtPass.getText())) {
                data.addAll(regla.verificaAcceso(txtLogin.getText(), pass_se, ""));
            }

            usuariosConAcceso = data;

            if (usuariosConAcceso.size() > 0) {
                if (usuariosConAcceso.get(0).getFlaghabilitado().equals("D")) {
                    JOptionPane.showMessageDialog(this, "Usuario deshabilitado, comunicarse con el administrador del sistema.", "Softcommerce", JOptionPane.WARNING_MESSAGE);
                    return false;
                }
                if (usuariosConAcceso.get(0).getFlagEscritorio().equals("N")) {
                    JOptionPane.showMessageDialog(this, "Usuario No tiene permiso para acceder al sistema, comunicarse con el administrador del sistema.", "Softcommerce", JOptionPane.WARNING_MESSAGE);
                    return false;
                }
                UsuarioAUD.CODIGO_USUARIO = usuariosConAcceso.get(0).getId_usuario();
                UsuarioAUD.NOMBRE_USUARIO = usuariosConAcceso.get(0).getNombre();
                UsuarioAUD.CODIGO_PERFIL = usuariosConAcceso.get(0).getCodPerfil();
                UsuarioAUD.CODIGO_LOCALIDAD = usuariosConAcceso.get(0).getCodlocalidad();
                UsuarioAUD.IP_USUARIO = InetAddress.getLocalHost().getHostAddress() + " / " + InetAddress.getLocalHost().getHostName();
                return true;
            } else {
                JOptionPane.showMessageDialog(this, "Porfavor verique que su nombre de usuario o contraseña este correctamente escrito.", "Usuario o contraseña incorrecto", JOptionPane.INFORMATION_MESSAGE);
                return false;
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
            return false;
        }
    }

    public void cargarEmpresa() {
        cboEmpresa.setEnabled(true);
        btnAceptar.setEnabled(true);

        Map<String, String> cuentas2 = new HashMap<String, String>(10);

        for (int i = 0; i < usuariosConAcceso.size(); i++) {
            cuentas2.put(usuariosConAcceso.get(i).getDescriempresa(), "");
        }

        Iterator<String> iter_empresa = cuentas2.keySet().iterator();

        while (iter_empresa.hasNext()) {
            cboEmpresa.addItem(iter_empresa.next().trim());
        }

        cboEmpresa.setSelectedIndex(0);

    }

    public boolean showSessionDialog() {
        //initAutomatico();
        setVisible(true);
        return bandera;
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
                if (saleDeSede == 1) {
                    dcFechaInicio.getDateEditor().getUiComponent().requestFocusInWindow();
                    saleDeSede = 0;
                    estaEnPass = 0;
                }
                if (estaEnPass == 1) {
                    saleDeSede = 1;
                }
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
*/
}
