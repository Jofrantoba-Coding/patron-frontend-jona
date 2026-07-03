package com.softcommerce.views.uiregisterdespacho;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.Empresa;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.BeanMoneda;
import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.BeanTipoDocVenta;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.entity.ControlDoc;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import com.softcommerce.general.controles.JHInternal;
import com.softcommerce.general.controles.CComboBox;
import com.softcommerce.iconos.Gif;
import java.awt.Component;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.ItemEvent;
import java.awt.event.KeyEvent;
import javax.swing.BorderFactory;
import java.awt.event.KeyListener;
import java.awt.Color;
import java.awt.Font;
import javax.swing.border.TitledBorder;
import java.util.Date;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.SwingConstants;
import javax.swing.border.LineBorder;
import javax.swing.event.InternalFrameEvent;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnEmpresa;
import com.softcommerce.reglasnegocio.RnLocalidad;
import java.util.ArrayList;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.Border;
import com.softcommerce.general.herramientas.CFunciones;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.controles.DigitTextFieldCellEditor;
import com.softcommerce.general.controles.EnumClass;
import com.softcommerce.general.controles.IntegerDocument;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.Toolkit;
import java.awt.event.FocusListener;
import java.awt.event.ItemListener;
import javax.swing.JCheckBox;
import javax.swing.JLabel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.report.Reporte;
import com.softcommerce.general.tablas.DocumentoVentaDetalleTableModel;
import com.softcommerce.logic.LogicConfigItemAlmacen;
import com.softcommerce.logic.LogicControlDoc;
import com.softcommerce.logic.LogicStock;
import com.softcommerce.reglasnegocio.RnMovInventarioCab;
import com.softcommerce.reglasnegocio.RnTipoDocVenta;
import com.softcommerce.util.render.CellRenderer;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.FormatObject;
import com.softcommerce.util.Util;
import com.softcommerce.util.combo.LoadCombo;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Iterator;
import org.apache.log4j.Logger;

public class UiRegisterDespacho
        extends JHInternal
        implements InterUiRegisterDespacho, ActionListener, ItemListener, KeyListener, FocusListener {

    private CComboBox cbo_serie;
    private List<UsuarioCorrelativo> x_serie;
    private CComboBox cbo_idtipodoc;
    private List<BeanTipoDocVenta> xTipoDocVenta;
    private CComboBox cbo_idalmacen;
    private List<Almacen> xalmacen;
    private CComboBox cbo_idlocalidad;
    private List<Localidad> xlocali;
    private CComboBox cbo_idpuntoventa;
    private List<PuntoVenta> xpuntoventa;
    private CComboBox cbo_idempresa;
    private List<Empresa> xempres;
    private CComboBox cbMoneda;
    private List<BeanMoneda> xmoneda = new ArrayList();
    private JDateChooser dc_fechaemision;
    private JTextField txt_idmovimientoorigen;
    private JTextField txtTipoCambio;
    private JTextField txt_serieref;
    private JTextField txt_preimpresoref;
    private JTextField txt_preimpreso;
    private JTextField txtRazonSocial;
    private JTextField txtCodCliente;
    private JTextField txtRuc;
    private JTextField txtMNoAfecto;
    private JTextField txtMDescuento;
    private JTextField txtMIgv;
    private JTextField txtMAfecto;
    private JTextField txtMonto;
    private JTextField txtCodRegContaCab1;
    private JTextField txtCodPuntoVenta;
    private JTextField txt_idtipodoc;
    private JTextField txt_idtipomovimiento;
    private JTextField txt_tipomov;
    private JTextField txt_idestado;
    private JTextField txt_idpuntoventa;
    private Usuario usuario;
    private JLabel lblRazonSocial;
    private JLabel lbl_RucCliente;
    private JButton btn_buscardocumento;
    private JTabbedPane tabb;
    private DocumentoVentaDetalleTableModel modeltable;
    private CTable tbl;
    private JFrame frm;
    private JPanel pnlCabezera;
    private JCheckBox check;
    private final Logger logger = Logger.getLogger(UiRegisterDespacho.class);

    public UiRegisterDespacho(String title, Usuario usuario, JFrame frm) {
        super(title);
        this.usuario = usuario;
        this.frm = frm;
        inicialize();
    }

    private void inicialize() {
        super.pnlRegister.setPreferredSize(new Dimension(980, 485));
        super.setMaximizable(false);
        super.setSize(1020, 545);
        super.setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2), (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);
        super.setResizable(false);

        Gif gif = new Gif();
        JPanel pnlDialog = new JPanel();
        pnlDialog.setLayout(null);
        pnlDialog.setBackground(new Color(245, 245, 245));

        JLabel lblSerie = new JLabel("N° Recojo");
        lblSerie.setBounds(15, 5, 60, 20);
        pnlDialog.add(lblSerie);

        cbo_serie = new CComboBox();
        cbo_serie.setFont(new Font(Font.SANS_SERIF, 0, 9));
        cbo_serie.setBounds(75, 5, 50, 20);
        cbo_serie.addKeyListener(this);
        cbo_serie.addActionListener(this);
        pnlDialog.add(cbo_serie);

        txt_preimpreso = new JTextField();
        txt_preimpreso.setBounds(130, 5, 85, 20);
        txt_preimpreso.addKeyListener(this);
        txt_preimpreso.setFont(new Font(Font.SANS_SERIF, Font.BOLD | Font.ITALIC, 12));
        txt_preimpreso.addFocusListener(this);
        txt_preimpreso.setDocument(new IntegerDocument(10));
        txt_preimpreso.setForeground(Color.BLACK);
        pnlDialog.add(txt_preimpreso);

        JLabel lblFechaEmision = new JLabel("F Emision");
        lblFechaEmision.setDisplayedMnemonic('c');
        lblFechaEmision.setBounds(230, 5, 50, 20);
        pnlDialog.add(lblFechaEmision);

        dc_fechaemision = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextFieldDateEditor) dc_fechaemision.getDateEditor()).addFocusListener(this);
        ((JTextFieldDateEditor) dc_fechaemision.getDateEditor()).addKeyListener(this);
        dc_fechaemision.setBounds(280, 5, 90, 20);
        dc_fechaemision.getJCalendar().addFocusListener(this);
        dc_fechaemision.getJCalendar().addKeyListener(this);
        dc_fechaemision.getCalendarButton().addActionListener(this);
        dc_fechaemision.addKeyListener(this);
        dc_fechaemision.addFocusListener(this);
        ((JTextField) dc_fechaemision.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                check.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dc_fechaemision.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_fechaemision.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        pnlDialog.add(dc_fechaemision);

        btn_buscardocumento = new JButton("F5", gif.SEARCH16);
        btn_buscardocumento.setBounds(380, 5, 70, 20);
        btn_buscardocumento.setMnemonic('B');
        btn_buscardocumento.setFont(new Font(Font.SANS_SERIF, 0, 9));
        btn_buscardocumento.setOpaque(false);
        btn_buscardocumento.setIconTextGap(10);
        btn_buscardocumento.setToolTipText("Buscar Documento");
        btn_buscardocumento.setHorizontalAlignment(SwingConstants.LEFT);
        btn_buscardocumento.setContentAreaFilled(true);
        btn_buscardocumento.setBorderPainted(true);
        btn_buscardocumento.setFocusable(true);
        btn_buscardocumento.setFocusPainted(false);
        btn_buscardocumento.addFocusListener(this);
        btn_buscardocumento.addActionListener(this);
        btn_buscardocumento.addKeyListener(this);
        btn_buscardocumento.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                ((JTextFieldDateEditor) dc_fechaemision.getDateEditor()).requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        pnlDialog.add(this.btn_buscardocumento);

        JLabel lblSerieRef = new JLabel("Ref");
        lblSerieRef.setBounds(460, 5, 20, 20);
        pnlDialog.add(lblSerieRef);

        cbo_idtipodoc = new CComboBox();
        cbo_idtipodoc.setFont(new Font(Font.SANS_SERIF, 0, 9));
        cbo_idtipodoc.setBounds(480, 5, 130, 20);
        cbo_idtipodoc.addActionListener(this);
        cbo_idtipodoc.addKeyListener(this);
        cbo_idtipodoc.setEnabled(false);
        pnlDialog.add(cbo_idtipodoc);

        txt_serieref = new JTextField();
        txt_serieref.setBounds(615, 5, 30, 20);
        txt_serieref.addKeyListener(this);
        txt_serieref.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_serieref.addFocusListener(this);
        FormatObject.formatJTextFieldSerie(txt_serieref);
        txt_serieref.setForeground(Color.BLACK);
        txt_serieref.setEnabled(false);
        pnlDialog.add(txt_serieref);

        txt_preimpresoref = new JTextField();
        txt_preimpresoref.setBounds(650, 5, 80, 20);
        txt_preimpresoref.addKeyListener(this);
        txt_preimpresoref.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_preimpresoref.addFocusListener(this);
        txt_preimpresoref.setDocument(new IntegerDocument(10));
        txt_preimpresoref.setForeground(Color.BLACK);
        txt_preimpresoref.setEnabled(false);
        pnlDialog.add(txt_preimpresoref);

        Border border = BorderFactory.createTitledBorder(null, "Datos de Documento", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);

        pnlCabezera = new JPanel();
        pnlCabezera.setLayout(null);
        pnlCabezera.setBackground(new Color(245, 245, 245));
        pnlCabezera.setBorder(border);
        pnlCabezera.setBounds(10, 28, 970, 95);

        JLabel lbl_idmovinventario = new JLabel("Cod");
        lbl_idmovinventario.setBounds(20, 25, 20, 20);
        pnlCabezera.add(lbl_idmovinventario);

        txt_idmovimientoorigen = new JTextField();
        txt_idmovimientoorigen.setEditable(false);
        txt_idmovimientoorigen.setBounds(40, 25, 90, 20);
        pnlCabezera.add(txt_idmovimientoorigen);

        cbo_idempresa = new CComboBox();
        cbo_idempresa.setFont(new Font(Font.SANS_SERIF, 0, 9));
        cbo_idempresa.setBounds(140, 25, 200, 20);
        cbo_idempresa.addKeyListener(this);
        cbo_idempresa.addActionListener(this);
        cbo_idempresa.setEnabled(false);
        pnlCabezera.add(cbo_idempresa);

        cbo_idlocalidad = new CComboBox();
        cbo_idlocalidad.setFont(new Font(Font.SANS_SERIF, 0, 9));
        cbo_idlocalidad.setBounds(345, 25, 190, 20);
        cbo_idlocalidad.addActionListener(this);
        cbo_idlocalidad.setEnabled(false);
        cbo_idlocalidad.addKeyListener(this);
        pnlCabezera.add(cbo_idlocalidad);

        cbo_idpuntoventa = new CComboBox();
        cbo_idpuntoventa.setFont(new Font(Font.SANS_SERIF, 0, 11));
        cbo_idpuntoventa.setBounds(540, 25, 210, 20);
        cbo_idpuntoventa.addActionListener(this);
        cbo_idpuntoventa.setEnabled(false);
        cbo_idpuntoventa.addKeyListener(this);
        pnlCabezera.add(cbo_idpuntoventa);

        cbo_idalmacen = new CComboBox();
        cbo_idalmacen.setFont(new Font(Font.SANS_SERIF, 0, 11));
        cbo_idalmacen.setBounds(755, 25, 210, 20);
        cbo_idalmacen.addActionListener(this);
        cbo_idalmacen.addKeyListener(this);
        cbo_idalmacen.setEnabled(false);
        pnlCabezera.add(cbo_idalmacen);

        lblRazonSocial = new JLabel("R. Social");
        lblRazonSocial.setBounds(20, 55, 50, 20);
        pnlCabezera.add(lblRazonSocial);

        txtCodCliente = new JTextField();
        txtCodCliente.setBounds(75, 55, 80, 20);
        txtCodCliente.addFocusListener(this);
        txtCodCliente.setEditable(false);
        txtCodCliente.addKeyListener(this);
        pnlCabezera.add(txtCodCliente);

        txtRazonSocial = new JTextField();
        txtRazonSocial.setBounds(165, 55, 350, 20);
        txtRazonSocial.addKeyListener(this);
        txtRazonSocial.setEditable(false);
        pnlCabezera.add(txtRazonSocial);

        lbl_RucCliente = new JLabel("RUC/DNI");
        lbl_RucCliente.setBounds(550, 55, 50, 20);
        pnlCabezera.add(lbl_RucCliente);

        txtRuc = new JTextField();
        txtRuc.setBounds(600, 55, 80, 20);
        txtRuc.addFocusListener(this);
        txtRuc.setEditable(false);
        txtRuc.addKeyListener(this);
        pnlCabezera.add(txtRuc);

        check = new JCheckBox("Seleccionar Todo");
        check.setBounds(5, 125, 150, 20);
        check.addItemListener(this);
        check.setFont(new Font("Verdana", 1, 11));
        check.addKeyListener(this);
        check.setHorizontalTextPosition(SwingConstants.LEFT);
        check.addFocusListener(this);
        check.setOpaque(false);
        pnlDialog.add(check);

        tabb = new JTabbedPane();
        JPanel pnltabb = new JPanel(new BorderLayout());
        pnltabb.setBackground(new Color(245, 245, 245));

        JPanel pnl = new JPanel(new BorderLayout());
        pnl.setBackground(new Color(245, 245, 245));
        modeltable = new DocumentoVentaDetalleTableModel();
        tbl = new CTable();
        tbl.setModel(modeltable);
        tbl.setAllColumnNoResizable();
        tbl.setAllTableNoEditable();
        tbl.setColumnEditor(11, new DigitTextFieldCellEditor(EnumClass.TipoDatoEditor.DOUBLE_EDITOR).cellEditor);
        tbl.setAllColumnPreferredWidth();
        CellRenderer render = new CellRenderer();
        tbl.setDefaultRenderer(Object.class, render);
        tbl.setDefaultRenderer(String.class, render);
        tbl.setDefaultRenderer(Double.class, render);
        JScrollPane scrollTableguiaventa = new JScrollPane(tbl);
        pnl.add(scrollTableguiaventa, BorderLayout.CENTER);
        pnltabb.add(pnl, BorderLayout.CENTER);

        tabb.setBounds(13, 150, 970, 270);
        tabb.addTab("", pnltabb);
        tabb.setTitleAt(0, "Item");
        pnlDialog.add(tabb);

        pnlDialog.add(pnlCabezera);

        txtCodRegContaCab1 = new JTextField();
        cbMoneda = new CComboBox();
        txtTipoCambio = new JTextField();
        txtMAfecto = new JTextField();
        txtCodPuntoVenta = new JTextField();
        txtMNoAfecto = new JTextField();
        txtMIgv = new JTextField();
        txtMDescuento = new JTextField();
        txtMonto = new JTextField();
        txt_idtipodoc = new JTextField();
        txt_idestado = new JTextField();
        txt_tipomov = new JTextField();
        txt_idtipomovimiento = new JTextField();
        txt_idpuntoventa = new JTextField();

        setTitleName("Orden de Recojo");
        setRegister(pnlDialog);
    }

    @Override
    public void loadCombo() {
        loadTipoDocumento();
        loadEmpresa();
        loadMoneda();
    }

    public void loadTipoDocumento() {
        try {
            RnTipoDocVenta regla_TipoDoc = new RnTipoDocVenta(path);
            if (xTipoDocVenta != null) {
                xTipoDocVenta.clear();
            } else {
                xTipoDocVenta = new ArrayList<BeanTipoDocVenta>();
            }

            xTipoDocVenta.addAll(regla_TipoDoc.listarTipoDocVenta("", "", "", "A", "VE", "", ""));

            cbo_idtipodoc.removeAllItems();
            for (int i = 0; i < xTipoDocVenta.size(); i++) {
                if (xTipoDocVenta.get(i).getIdTipoDoc().equals("CO")) {
                    xTipoDocVenta.remove(i);
                }
                cbo_idtipodoc.addItem(xTipoDocVenta.get(i).getDescripcion());
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadSerieCorrelativo(String id_tipodoc) {
        try {
            RnCorrelativo regla_correlativo = new RnCorrelativo(path);

            if (x_serie != null) {
                x_serie.clear();
            } else {
                x_serie = new ArrayList();
            }
            x_serie.addAll(regla_correlativo.listarCorrelativo(usuario.getId_usuario(), usuario.getCodpuntoventa(), id_tipodoc));
            cbo_serie.removeAllItems();

            for (int i = 0; i < x_serie.size(); i++) {
                cbo_serie.addItem(x_serie.get(i).getSerie());
            }

            if (cbo_serie.getItemCount() > 0) {
                cbo_serie.setSelectedIndex(0);
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadEmpresa() {
        try {
            RnEmpresa regla_Empresa = new RnEmpresa(path);

            if (xempres != null) {
                xempres.clear();
            } else {
                xempres = new ArrayList<Empresa>();
            }

            xempres.addAll(regla_Empresa.listarEmpresa(""));

            cbo_idempresa.removeAllItems();
            cbo_idempresa.addItem("--- Seleccione una Empresa ---");

            for (int i = 0; i < xempres.size(); i++) {
                cbo_idempresa.addItem(xempres.get(i).getNombre());
            }

            cbo_idempresa.setSelectedIndex(0);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadMoneda() {
        try {
            LoadCombo.loadMoneda(path, xmoneda, cbMoneda,
                    Constans.ITEM_INIT_MONEDA, 0);
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    public void loadLocalidad(String xcodEmpres) {
        try {
            RnLocalidad regla_Localidad = new RnLocalidad(path);

            if (xlocali != null) {
                xlocali.clear();
            } else {
                xlocali = new ArrayList<Localidad>();
            }

            xlocali.addAll(regla_Localidad.listar("", xcodEmpres, "", "", ""));

            cbo_idlocalidad.removeAllItems();
            cbo_idlocalidad.addItem("--- Seleccione una Localidad ---");

            for (int i = 0; i < xlocali.size(); i++) {
                cbo_idlocalidad.addItem(xlocali.get(i).getDescripcion());
            }

            cbo_idlocalidad.setSelectedIndex(0);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadPuntoVenta(String xcodLocalidad) {
        try {
            RnPuntoVenta regla_PuntoVenta = new RnPuntoVenta(path);

            if (xpuntoventa != null) {
                xpuntoventa.clear();
            } else {
                xpuntoventa = new ArrayList<PuntoVenta>();
            }

            xpuntoventa.addAll(regla_PuntoVenta.listar("", "", xcodLocalidad, "", "", "", "", ""));

            cbo_idpuntoventa.removeAllItems();
            cbo_idpuntoventa.addItem("--- Seleccione un Punto de Venta ---");

            for (int i = 0; i < xpuntoventa.size(); i++) {
                cbo_idpuntoventa.addItem(xpuntoventa.get(i).getDescripcion_puntoventa());
            }

            cbo_idpuntoventa.setSelectedIndex(0);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadAlmacen(String xcodPuntoVenta) {
        try {
            RnAlmacen regla_Almacen = new RnAlmacen(path);
            if (xalmacen != null) {
                xalmacen.clear();
            } else {
                xalmacen = new ArrayList();
            }
            xalmacen.addAll(regla_Almacen.listar("", "", xcodPuntoVenta));
            cbo_idalmacen.removeAllItems();
            cbo_idalmacen.addItem("--- Seleccione un Almacen ---");
            for (int i = 0; i < xalmacen.size(); i++) {
                cbo_idalmacen.addItem(xalmacen.get(i).getDescripcion());
            }
            cbo_idalmacen.setSelectedIndex(0);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void newRegister() {
        try {
            JTextField txt = new JTextField();
            txt_preimpreso.setBorder(txt.getBorder());
            dc_fechaemision.setBorder(new JDateChooser().getBorder());
            tabb.setBorder(txt.getBorder());
            txt_serieref.setBorder(txt.getBorder());
            txt_preimpresoref.setBorder(txt.getBorder());

            txtCodRegContaCab1.setText("");
            txt_serieref.setText("");
            txt_preimpresoref.setText("");
            txt_idmovimientoorigen.setText("");
            txtRazonSocial.setText("");
            txtCodCliente.setText("");
            txtRuc.setText("");

            txtTipoCambio.setText("");
            txt_preimpreso.setText("");
            txtMAfecto.setText("0.0");
            txtMDescuento.setText("0.0");
            txtMIgv.setText("0.0");
            txtMNoAfecto.setText("0.0");
            txtMonto.setText("0.0");
            txt_idtipomovimiento.setText("002");
            txt_idtipodoc.setText("NS");
            txt_tipomov.setText("S");
            txt_idestado.setText("005");
            txt_idpuntoventa.setText(usuario.getCodpuntoventa());

            if (mode == INSERT) {
                loadSerieCorrelativo(txt_idtipodoc.getText().trim());
            }

            if (mode == INSERT && cbo_serie.getItemCount() > 0) {
                this.mostrarPreimpreso();
            }

            tbl.setAllColumnPreferredWidth();

            cbMoneda.setSelectedIndex(0);
            cbo_idempresa.setSelectedIndex(0);
            cbo_idtipodoc.setSelectedIndex(0);

            if (mode == INSERT) {
                cargarEmpresa(usuario.getCodempresa());
                cargarLocalidad(usuario.getCodlocalidad());
                cargarPuntoVenta(usuario.getCodpuntoventa());
                if (cbo_idalmacen.getItemCount() > 0) {
                    cbo_idalmacen.setSelectedIndex(1);
                }
                txtCodPuntoVenta.setText(usuario.getCodpuntoventa());
            }

            txt_preimpreso.requestFocus();
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public String executeInsert() {
        try {
            RnMovInventarioCab logic = new RnMovInventarioCab(path);
            ContaCab m = new ContaCab();
            m.setIdEmpresa(usuario.getCodempresa());
            m.setIdLocalidad(usuario.getCodlocalidad());
            m.setIdPuntoventa(usuario.getCodpuntoventa());
            m.setSerie(x_serie.get(cbo_serie.getSelectedIndex()).getSerie());
            m.setIdAlmacen(cbo_idalmacen.getSelectedIndex() > 0 ? xalmacen.get(cbo_idalmacen.getSelectedIndex() - 1).getIdAlmacen() : "");
            m.setPreimpreso(txt_preimpreso.getText().trim());
            m.setIdMoneda(cbMoneda.getSelectedIndex() > 0 ? xmoneda.get(cbMoneda.getSelectedIndex() - 1).getIdMoneda() : "");
            m.setMTipoCambio(txtTipoCambio.getText().trim().equals("") ? 0.0 : Double.valueOf(txtTipoCambio.getText().trim()));
            m.setFEmision(dc_fechaemision.getDate());
            m.setFTraslado(dc_fechaemision.getDate());
            m.setIdUsuario(usuario.getId_usuario());
            m.setAnIdanexo(txtCodCliente.getText().trim());
            m.setIdCorrelativo(x_serie.get(cbo_serie.getSelectedIndex()).getIdCorrelativo());
            m.setIdRegcontaDoc1(txtCodRegContaCab1.getText());
            m.setSerieRef1(txt_serieref.getText());
            m.setPreimpresoRef1(txt_preimpresoref.getText());
            List<ContaItem> listaItem = modeltable.getData();
            List<ContaItem> lista = new ArrayList();
            Iterator<ContaItem> iterLista = listaItem.iterator();
            while (iterLista.hasNext()) {
                ContaItem contItem = iterLista.next();
                if (contItem.isSeleccionado()) {
                    lista.add(contItem);
                }
            }
            if (!validarFechas(lista.get(0).getF_emision(), m.getFEmision())) {
                return "errorFechaRecojo";
            }

            m.setMovDet(lista);
            HashMap<String, List<ControlDoc>> listaDocumentosValidos = this.getDocumentosValidos(lista);

            if (!this.isValidDocument(lista, listaDocumentosValidos)) {
                return "";
            }
            String codigoMovCab = logic.insertarSalidaOrdenRecojo(m);
            this.regularizarDocumento(codigoMovCab, m.getMovDet().get(0));
            return codigoMovCab;
        } catch (ClassNotFoundException ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        } catch (InstantiationException ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        } catch (IllegalAccessException ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        } finally {
            try {
                (new LogicStock(path)).regularizarStock(Main.anio);
                System.out.println(Main.anio);
            } catch (ClassNotFoundException ex) {
                System.err.println(ex.getLocalizedMessage());
            } catch (InstantiationException ex) {
                System.err.println(ex.getLocalizedMessage());
            } catch (IllegalAccessException ex) {
                System.err.println(ex.getLocalizedMessage());
            } catch (Exception ex) {
                System.err.println(ex.getLocalizedMessage());
            }
        }
        return "error";
    }

    private void regularizarDocumento(String idMovInventarioCab, ContaItem item) {
        LogicControlDoc log = new LogicControlDoc(path);
        String msg;
        try {
            msg = log.regularizarEstadoXDocAtendido(item.getId_tipo_doc(), item.getSerie(), item.getPreimpreso());
            msg = msg + "\n" + idMovInventarioCab + "\n";
            msg = msg + "Tipo Doc: " + item.getId_tipo_doc() + "\n";
            msg = msg + "Serie: " + item.getSerie() + "\n";
            msg = msg + "PreImpreso: " + item.getPreimpreso();
            JOptionPane.showMessageDialog(null, msg);
        } catch (ClassNotFoundException ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        } catch (InstantiationException ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        } catch (IllegalAccessException ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        }
    }

    private boolean isValidDocument(List<ContaItem> lista, HashMap<String, List<ControlDoc>> listaDocumentosValidos)
            throws InstantiationException, IllegalAccessException, Exception {
        try {
            for (int i = 0; i < lista.size(); i++) {
                ContaItem item = lista.get(i);
                List<ControlDoc> listaValida = listaDocumentosValidos.get(item.getId_regcontacab());
                for (int j = 0; j < listaValida.size(); j++) {
                    ControlDoc doc = listaValida.get(j);
                    if (this.isValidDocument(item, doc)) {
                        LogicConfigItemAlmacen logic = new LogicConfigItemAlmacen(path);
                        BigDecimal cantidadADespachar = BigDecimal.valueOf(Double.valueOf(item.getCantidad_despachar()));
                        BigDecimal xdespachar = doc.getResultado();
                        if (xdespachar.compareTo(cantidadADespachar) == -1) {
                            JOptionPane.showMessageDialog(null, "Error al validar Ingreso, \n Quiza el Documento se atendio totalmente");
                            return false;
                        }
                        if (logic.isValidaConfig(item.getId_item(), item.getId_almacen(), "DESPACHO")) {
                            JOptionPane.showConfirmDialog(null, "Comuniquese con Logistica \n Item: "
                                    + item.getId_item() + " desactivado en \n almacen: "
                                    + item.getAlmacen() + " \n activese la configuración para Despacho",
                                    "Alerta", JOptionPane.WARNING_MESSAGE);
                            return false;
                        }
                    }
                }
            }
            return true;
        } catch (InstantiationException e) {
            throw e;
        } catch (IllegalAccessException e) {
            throw e;
        } catch (Exception e) {
            throw e;
        }
    }

    private boolean isValidDocument(ContaItem item, ControlDoc doc) {
        return item.getId_item().equalsIgnoreCase(doc.getIdItemVenta())
                && item.getId_almacen().equalsIgnoreCase(doc.getIdAlmacenVenta())
                && item.getSerie().equalsIgnoreCase(doc.getSeriedoc())
                && item.getId_tipo_doc().equalsIgnoreCase(doc.getIdTipoDoc())
                && item.getPreimpreso().equalsIgnoreCase(doc.getPreimpresodoc());
    }

    private HashMap<String, List<ControlDoc>> getDocumentosValidos(List<ContaItem> lista)
            throws InstantiationException, IllegalAccessException, Exception {
        try {
            HashMap<String, List<ControlDoc>> listaDocumentosValidos = new HashMap();
            Iterator<ContaItem> iterador = lista.iterator();
            while (iterador.hasNext()) {
                LogicControlDoc logic = new LogicControlDoc(path);
                ContaItem docBean = iterador.next();
                List<ControlDoc> listaValida = logic.listaItemDocAlmacenDespacho(docBean.getId_tipo_doc(), docBean.getSerie(), docBean.getPreimpreso());
                listaDocumentosValidos.put(docBean.getId_regcontacab(), listaValida);
            }
            return listaDocumentosValidos;
        } catch (InstantiationException e) {
            throw e;
        } catch (IllegalAccessException e) {
            throw e;
        } catch (Exception e) {
            throw e;
        }
    }

    private boolean validarFechas(java.util.Date fechaInicio, java.util.Date fechaFin) {
        Calendar calendarIni = new GregorianCalendar();
        Calendar calendarFin = new GregorianCalendar();
        calendarIni.setTime(fechaInicio);
        calendarFin.setTime(fechaFin);
        int annoInicio = calendarIni.get(Calendar.YEAR);
        int mesInicio = calendarIni.get(Calendar.MONTH);
        int diaInicio = calendarIni.get(Calendar.DAY_OF_MONTH);
        int annoFin = calendarFin.get(Calendar.YEAR);
        int mesFin = calendarFin.get(Calendar.MONTH);
        int diaFin = calendarFin.get(Calendar.DAY_OF_MONTH);
        if (annoFin == annoInicio) {
            if (mesFin == mesInicio) {
                return diaFin >= diaInicio;
            } else {
                return mesFin > mesInicio;
            }
        } else {
            return annoFin > annoInicio;
        }

    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getComponent() == txt_preimpreso) {
            txt_preimpreso.selectAll();
        }

        if (e.getSource() == ((JTextFieldDateEditor) dc_fechaemision.getDateEditor())) {
            ((JTextFieldDateEditor) dc_fechaemision.getDateEditor()).selectAll();
        }

        if (e.getComponent() == txt_serieref) {
            txt_serieref.selectAll();
        }

        if (e.getComponent() == txt_preimpresoref) {
            txt_preimpresoref.selectAll();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txt_serieref || e.getSource() == txt_preimpresoref) {
                if (txt_serieref.getText().trim().length() > 0) {
                    String preimpreso = "000" + txt_serieref.getText().trim();
                    String nuevapreimpreso = preimpreso.substring(preimpreso.length() - 3, preimpreso.length());

                    txt_serieref.setText(nuevapreimpreso);
                }

                if (txt_preimpresoref.getText().trim().length() > 0) {
                    String preimpreso = "0000000000" + txt_preimpresoref.getText().trim();
                    String nuevapreimpreso = preimpreso.substring(preimpreso.length() - 10, preimpreso.length());

                    txt_preimpresoref.setText(nuevapreimpreso);
                }

                if (txt_serieref.getText().trim().length() < 3 || txt_preimpresoref.getText().trim().length() < 10) {
                    JOptionPane.showMessageDialog(this, "El numero de " + (txt_serieref.getText().trim().length() < 3 ? "Serie " : (txt_preimpreso.getText().trim().length() == 0 ? "Preimpreso " : " ")) + "del Documento ingresado es incorrecto.", "N° de Serie incompleto.", JOptionPane.INFORMATION_MESSAGE);
                } else {
                    RnRegContaCab regla_regconta = new RnRegContaCab(path);
                    ContaCab r = new ContaCab();
                    r.setIdEmpresa(usuario.getCodempresa());
                    r.setIdLocalidad(usuario.getCodlocalidad());
                    r.setIdPuntoventa(usuario.getCodpuntoventa());
                    r.setSerie(txt_serieref.getText().trim());
                    r.setPreimpreso(txt_preimpresoref.getText().trim());
                    r.setFInicial(new Date(1901, 0, 1));
                    r.setFFinal(new Date(1901, 0, 1));

                    if (regla_regconta.listar(r).size() > 0) {
                        cargarDocumentoVenta("", txt_serieref.getText().trim(), txt_preimpresoref.getText().trim());
                    }
                }
            }

            if (e.getSource() == cbo_serie) {
                txt_preimpreso.requestFocus();
            }

            if (e.getSource() == txt_preimpreso) {
                btn_buscardocumento.requestFocus();
            }

            if (e.getSource() == check) {
                setFocusAndClick();
            }
        }

        if (e.getKeyCode() == KeyEvent.VK_F5) {
            btn_buscardocumento.requestFocus();
            btn_buscardocumento.doClick();
        }

        if (e.getKeyCode() == KeyEvent.VK_F6) {
            check.requestFocus();
            check.doClick();
        }

        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
            doDefaultCloseAction();
        }
    }

    @Override
    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        txt_preimpreso.setBorder(txt.getBorder());
        dc_fechaemision.setBorder(new JDateChooser().getBorder());
        tabb.setBorder(txt.getBorder());
        txt_serieref.setBorder(txt.getBorder());
        txt_preimpresoref.setBorder(txt.getBorder());
        String id_almacen = xalmacen.get(cbo_idalmacen.getSelectedIndex() - 1).getIdAlmacen();
        String res = "";
        RnAlmacen regla_Almacen = new RnAlmacen(path);
        try {
            res = regla_Almacen.validarDespacho(id_almacen);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.toString());
        }

        if (res.equals("N")) {
            JOptionPane.showMessageDialog(this, "Este almacen no esta habilitado para despachar, "
                    + "por favor direccione el documento",
                    "Error en almacen de despacho.", JOptionPane.CANCEL_OPTION);
            cbo_serie.setBorder(new LineBorder(Color.RED));
            cbo_serie.requestFocus();
            return false;
        }

        if (!(cbo_serie.getSelectedIndex() >= 0)) {
            JOptionPane.showMessageDialog(this, "Serie de Orden de Recojo es incorrecto,Por favor verifique la Serie de Orden de Recojo.", "Datos incompletos de Orden de Recojo.", JOptionPane.CANCEL_OPTION);
            cbo_serie.setBorder(new LineBorder(Color.RED));
            cbo_serie.requestFocus();
            return false;
        }

        if (txt_preimpreso.getText().trim().length() < 10) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " una Orden de Recojo, debes especificar el Preimpreso.", "Datos incompletos de Orden de Recojo.", JOptionPane.CANCEL_OPTION);
            txt_preimpreso.setBorder(new LineBorder(Color.RED));
            txt_preimpreso.requestFocus();
            return false;
        }

        if (((JTextFieldDateEditor) dc_fechaemision.getDateEditor()).getText().equals("__/__/____")
                || !DateTime.isValidDate(((JTextFieldDateEditor) dc_fechaemision.getDateEditor()).getText().replace("_", "0"))) {
            JOptionPane.showMessageDialog(this, "La fecha de Emision de la Orden de Recojo que has especificado no es válida. Compruébala e inténtalo de nuevo.", "Datos incompletos de Orden de Recojo", 2);
            ((JTextFieldDateEditor) dc_fechaemision.getDateEditor()).setBorder(new LineBorder(Color.RED));
            ((JTextFieldDateEditor) dc_fechaemision.getDateEditor()).requestFocus();

            return false;
        }

        if (tbl.getRowCount() <= 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " una Orden de Recojo, debes de registrar al menos un Item.", "Datos incompletos de Orden de Recojo.", JOptionPane.CANCEL_OPTION);
            tabb.setBorder(new LineBorder(Color.RED));
            return false;
        }

        boolean flag = false;

        for (int i = 0; i < tbl.getRowCount(); i++) {
            if (!modeltable.getDocumentoVentaDet(tbl.convertRowIndexToModel(i)).getCantidad_despachar().toString().trim().equals("")) {
                if (!Double.valueOf(modeltable.getDocumentoVentaDet(tbl.convertRowIndexToModel(i)).getCantidad_despachar().toString().trim()).equals(0.0)) {
                    flag = true;
                    break;
                }
            }
        }

        if (!flag) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " una Orden de Recojo, debe registrar al menos un detalle.", "Datos incompletos de Orden de Recojo.", JOptionPane.CANCEL_OPTION);
            tabb.setBorder(new LineBorder(Color.RED));
            return false;
        }

        RnRegContaCab regla = new RnRegContaCab(path);
        ContaCab m = new ContaCab();
        m.setIdEmpresa(usuario.getCodempresa());
        m.setIdTipoDoc(txt_idtipodoc.getText().trim());
        m.setSerie(cbo_serie.getSelectedItem().toString().trim());
        m.setPreimpreso(txt_preimpreso.getText().trim());
        flag = regla.existeMovimiento(m).equals("S");

        if (flag) {
            JOptionPane.showMessageDialog(this, "El numero de Orden de Recojo ya se encuentra registrado, por favor ingrese otro Numero de Orden de Recojo.", "Datos incompletos de Orden de Recojo", JOptionPane.INFORMATION_MESSAGE);
            txt_preimpreso.setBorder(new LineBorder(Color.RED));
            txt_preimpreso.requestFocus();

            return false;
        }

        for (int i = 0; i < tbl.getRowCount(); i++) {
            if (!modeltable.getDocumentoVentaDet(tbl.convertRowIndexToModel(i)).getCantidad_despachar().trim().equals("")) {
                if ((Double.valueOf(modeltable.getDocumentoVentaDet(tbl.convertRowIndexToModel(i)).getCantidad_despachar().trim())
                        > Double.valueOf(modeltable.getDocumentoVentaDet(tbl.convertRowIndexToModel(i)).getTransito()))) {
                    JOptionPane.showMessageDialog(this, "Para " + namemode + " una Orden de Recojo,la Cantidad a Ingresar debe ser menor o igual que la cantidad Pendiente y/o menor o igual que la cantidad Disponible.", "Datos incompletos de Orden de Recojo.", JOptionPane.CANCEL_OPTION);
                    tabb.setBorder(new LineBorder(Color.RED));
                    tbl.setRowSelectionInterval(i, i);
                    return false;
                }
            }

        }
        return true;
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_serieref && txt_serieref.getText().trim().length() > 0) {
            String serie = "000" + txt_serieref.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 3, serie.length());
            txt_serieref.setText(nuevaserie);
        }

        if (e.getSource() == txt_preimpresoref && txt_preimpresoref.getText().trim().length() > 0) {
            String preimpreso = "0000000000" + txt_preimpresoref.getText().trim();
            String nuevapreimpreso = preimpreso.substring(preimpreso.length() - 10, preimpreso.length());
            txt_preimpresoref.setText(nuevapreimpreso);
        }

        if (e.getSource() == txt_preimpreso && txt_preimpreso.getText().trim().length() > 0) {
            String preimpreso = "0000000000" + txt_preimpreso.getText().trim();
            String nuevapreimpreso = preimpreso.substring(preimpreso.length() - 10, preimpreso.length());
            txt_preimpreso.setText(nuevapreimpreso);
        }
    }

    public void cargarDocumentoVenta(String codOrdenCompra, String serie, String preimpreso) {
        try {
            ContaCab m = new ContaCab();
            m.setRcIdregconta(codOrdenCompra);
            m.setFEmision(new Date(1901, 0, 1));
            m.setFInicial(new Date(1901, 0, 1));
            m.setFFinal(new Date(1901, 0, 1));
            m.setSerie(serie);
            m.setPreimpreso(preimpreso);

            RnRegContaCab regla = new RnRegContaCab(path);
            List<ContaCab> reg = regla.listarDocumentosVenta(m);

            if (reg != null && reg.size() > 0) {
                newRegister();

                if (mode == INSERT) {
                    if (cbo_serie.getSelectedIndex() > -1) {
                        mostrarPreimpreso();
                    }
                }

                ContaCab regconta = reg.get(0);

                txtRazonSocial.setText(regconta.getAnTmpanexo());
                txtRuc.setText(regconta.getAnTmpruc());
                txt_serieref.setText(regconta.getSerie());
                txt_preimpresoref.setText(regconta.getPreimpreso());
                cargarTipoDocumento(regconta.getIdTipoDoc());
                cargarMoneda(regconta.getIdMoneda());
                txtMDescuento.setText(String.valueOf(regconta.getMDescuento()));
                txtMAfecto.setText(String.valueOf(regconta.getMAfecto()));
                txtMNoAfecto.setText(String.valueOf(regconta.getMNoafecto()));
                txtMIgv.setText(String.valueOf(regconta.getMIgv()));
                txtMonto.setText(String.valueOf(regconta.getMonto()));
                txtCodCliente.setText(regconta.getAnIdanexo());
                txtCodRegContaCab1.setText(regconta.getRcIdregconta());

                ContaCab r = new ContaCab();
                r.setSerie(serie);
                r.setPreimpreso(preimpreso);
                r.setRcIdregconta(codOrdenCompra);
                r.setFEmision(DateTime.format(1901, 0, 1));
                r.setFInicial(DateTime.format(1901, 0, 1));
                r.setFFinal(DateTime.format(1901, 0, 1));
                r.setIdPuntoventa(usuario.getCodpuntoventa());
                r.setTieneCantPordespacharCliente("SI");

                modeltable.clearTable();
                modeltable.agregarVectorRegContaItem(regla.listarRegContaDet(r));
                tbl.setAllColumnPreferredWidth();

                btn_buscardocumento.requestFocus();
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void cargarDocumentoVenta(List<ContaItem> m) {
        ContaItem contaItem = m.get(0);
        txtCodCliente.setText(contaItem.getId_anexo());
        txtRazonSocial.setText(contaItem.getTmpanexo());
        txtRuc.setText(contaItem.getTmpruc());
        cargarAlmacen(contaItem.getId_almacen());

        txtCodRegContaCab1.setText(contaItem.getId_regcontacab());
        txt_serieref.setText(contaItem.getSerie());
        txt_preimpresoref.setText(contaItem.getPreimpreso());
        this.setTipoDocRef(contaItem.getId_tipo_doc());
        modeltable.clearTable();
        check.setSelected(true);
        modeltable.agregarVectorRegContaItem(m);
        tbl.setAllColumnPreferredWidth();
        check.requestFocus();
    }

    private void setTipoDocRef(String idTipoDoc) {
        System.out.println("idTipoDoc = " + idTipoDoc);
        cbo_idtipodoc.setSelectedIndex(this.getPosTipoDoc(idTipoDoc));
    }

    private int getPosTipoDoc(String idTipoDoc) {
        for (int i = 0; i < xTipoDocVenta.size(); i++) {
            if (xTipoDocVenta.get(i).getIdTipoDoc().equals(idTipoDoc)) {
                return i;
            }
        }
        return -1;
    }

    @Override
    public void setRegisterEditable(boolean e) {
        tbl.setColumnEditable(0, e);
        tbl.setColumnEditable(11, e);
        txt_preimpreso.setEditable(e);
        txt_serieref.setEditable(e);
        txt_preimpresoref.setEditable(e);
    }

    @Override
    public void setRegisterEnabled(boolean e) {
        cbo_serie.setEnabled(e);
        dc_fechaemision.setEnabled(e);
        btn_buscardocumento.setEnabled(e);
        check.setEnabled(e);
        tabb.setEnabled(e);
        tbl.setEnabled(e);
    }

    public void cargarSerieCorrelativo(String ls_Serie) {
        if (x_serie != null) {
            for (int i = 0; i < x_serie.size(); i++) {
                if (x_serie.get(i).getSerie().equals(ls_Serie)) {
                    cbo_serie.setSelectedIndex(i);
                    break;
                }
            }
        }
    }

    @Override
    public boolean loadRegister() {
        try {
            ContaCab m = new ContaCab();
            m.setIdMovimiento(rowSelection.getSelectedValue(1).toString());
            m.setTipo("S");
            m.setFInicial(new Date(1901, 0, 1));
            m.setFFinal(new Date(1901, 0, 1));

            RnRegContaCab regla = new RnRegContaCab(path);

            List<ContaCab> reg = regla.listarOrdenRecojo(m);

            if (reg.isEmpty()) {
                return false;
            }
            ContaCab movintentarioCab = reg.get(0);

            txt_idtipomovimiento.setText(movintentarioCab.getIdTipoMov());
            if (mode != CLONE) {
                txt_idmovimientoorigen.setText(movintentarioCab.getIdMovimiento());
            }
            txtCodRegContaCab1.setText(movintentarioCab.getIdRegcontaDoc1());
            txt_serieref.setText(movintentarioCab.getSerieRef());
            txt_preimpresoref.setText(movintentarioCab.getPreimpresoRef());
            txtCodCliente.setText(movintentarioCab.getAnIdanexo());
            txtCodRegContaCab1.setText(movintentarioCab.getOcIdordencompra());
            dc_fechaemision.setDate(movintentarioCab.getFEmision());
            txtMAfecto.setText(String.valueOf(movintentarioCab.getMAfecto()));
            txtMDescuento.setText(String.valueOf(movintentarioCab.getMDescuento()));
            txtMIgv.setText(String.valueOf(movintentarioCab.getMIgv()));
            txtMNoAfecto.setText(String.valueOf(movintentarioCab.getMNoafecto()));
            txtMonto.setText(String.valueOf(movintentarioCab.getMonto()));
            txtRazonSocial.setText(movintentarioCab.getAnTmpanexo());
            txtRuc.setText(movintentarioCab.getAnTmpruc());
            txt_idtipodoc.setText(movintentarioCab.getIdTipoDoc());
            txt_preimpreso.setText(movintentarioCab.getSeriePreimpreso().substring(4, 14).trim());
            cargarSerieCorrelativo(movintentarioCab.getSeriePreimpreso().substring(0, 3).trim());
            txt_serieref.setText(movintentarioCab.getSerieRef1());
            txt_preimpresoref.setText(movintentarioCab.getPreimpresoRef1());
            txtTipoCambio.setText(String.valueOf(movintentarioCab.getMTipoCambio()));
            cargarTipoDocumento(movintentarioCab.getIdTipoDocRef1());
            cargarEmpresa(movintentarioCab.getIdEmpresa());
            cargarLocalidad(movintentarioCab.getIdLocalidad());
            boolean isVisibleColumn = mode == UPDATE || mode == INSERT || mode == CLONE;
            tbl.setVisibleColumn(0, isVisibleColumn);
            tbl.setVisibleColumn(9, isVisibleColumn);
            tbl.setVisibleColumn(10, isVisibleColumn);
            tbl.setVisibleColumn(11, isVisibleColumn);
            tbl.setVisibleColumn(13, isVisibleColumn);

            modeltable.clearTable();
            modeltable.agregarVectorRegContaItem(regla.BuscaDetalleMovimiento(movintentarioCab.getIdMovimiento(), "S", ""));
            tbl.setAllColumnPreferredWidth();
            return true;
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    @Override
    public void setFecha(Date fechaInicio, Date fechaFin) {
        java.util.Date fechaEmision = new java.util.Date(Main.fechaActualServer.getTime());
        dc_fechaemision.setDate(fechaEmision);
        dc_fechaemision.setSelectableDateRange(((Main) frm).getFechaInicio(), fechaEmision);
    }

    public void cargarEmpresa(String xcodiEmpresa) {
        if (xempres != null) {
            for (int i = 0; i < xempres.size(); i++) {
                if (xempres.get(i).getId_empresa().equals(xcodiEmpresa)) {
                    cbo_idempresa.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public void cargarLocalidad(String xcodiLocalidad) {
        if (xlocali != null) {
            for (int i = 0; i < xlocali.size(); i++) {
                if (xlocali.get(i).getId_localidad().equals(xcodiLocalidad)) {
                    cbo_idlocalidad.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public void cargarAlmacen(String xcodiEmpresa) {
        if (xalmacen != null) {
            for (int i = 0; i < xalmacen.size(); i++) {
                if (xalmacen.get(i).getIdAlmacen().equals(xcodiEmpresa)) {
                    cbo_idalmacen.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public void cargarTipoDocumento(String codTipoMov) {
        if (xTipoDocVenta != null && !codTipoMov.equals("")) {
            for (int i = 0; i < xTipoDocVenta.size(); i++) {
                if (xTipoDocVenta.get(i).getIdTipoDoc().equals(codTipoMov)) {
                    cbo_idtipodoc.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public void cargarMoneda(String codMoneda) {
        if (xmoneda != null && !codMoneda.equals("")) {
            for (int i = 0; i < xmoneda.size(); i++) {
                if (xmoneda.get(i).getIdMoneda().equals(codMoneda)) {
                    cbMoneda.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public void cargarPuntoVenta(String codPuntoVenta) {
        if (xpuntoventa != null && !codPuntoVenta.equals("")) {
            for (int i = 0; i < xpuntoventa.size(); i++) {
                if (xpuntoventa.get(i).getId_punto_venta().equals(codPuntoVenta)) {
                    cbo_idpuntoventa.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    @Override
    public void setValueSearch(Object m, Component comp) {
        if (comp == btn_buscardocumento) {
            cargarDocumentoVenta((List<ContaItem>) m);
        }
    }

    @Override
    public void showMessagePrint(String codigo) {
        try {
            Reporte report = new Reporte(path);
            report.generarReporte("Despacho", codigo, "", "", "", "", "", true, false,
                    "Reporte Despacho");
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    public void mostrarPreimpreso() {
        try {
            RnCorrelativo logic = new RnCorrelativo(path);
            String preimpreso = logic.listarPreimpreso(x_serie.get(cbo_serie.getSelectedIndex()).getIdCorrelativo());
            txt_preimpreso.setText(Util.getPreimpresoValue(preimpreso));
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {

        if (btn_buscardocumento == e.getSource()) {
            BuscarOrdenRecojo buscarOrdenRecojo = new BuscarOrdenRecojo(frm, this, usuario, path);
            buscarOrdenRecojo.cargarTabla(btn_buscardocumento);
        }

        if (cbo_idempresa == e.getSource()) {
            if (cbo_idempresa.getItemCount() > 0) {
                if (cbo_idempresa.getSelectedIndex() == 0) {
                    cbo_idlocalidad.removeAllItems();
                    cbo_idpuntoventa.removeAllItems();
                    cbo_idalmacen.removeAllItems();
                } else {
                    loadLocalidad(xempres.get(cbo_idempresa.getSelectedIndex() - 1).getId_empresa());
                }
            }
        }

        if (cbo_serie == e.getSource() && mode == INSERT) {
            if (cbo_serie.getSelectedIndex() > -1) {
                mostrarPreimpreso();
            }

        }

        if (cbo_idlocalidad == e.getSource()) {
            if (cbo_idlocalidad.getItemCount() > 0) {
                if (cbo_idlocalidad.getSelectedIndex() == 0) {
                    cbo_idpuntoventa.removeAllItems();
                    cbo_idalmacen.removeAllItems();
                } else {
                    loadPuntoVenta(xlocali.get(cbo_idlocalidad.getSelectedIndex() - 1).getId_localidad());
                }
            }
        }

        if (cbo_idpuntoventa == e.getSource()) {
            if (cbo_idpuntoventa.getItemCount() > 0) {
                if (cbo_idpuntoventa.getSelectedIndex() == 0) {
                    cbo_idalmacen.removeAllItems();
                } else {
                    loadAlmacen(xpuntoventa.get(cbo_idpuntoventa.getSelectedIndex() - 1).getId_punto_venta());
                }
            }
        }
    }

    public boolean quitarRegContaItem(String id_movinventario, String codItem, double afecto_ac, double no_afecto_ac, double igv_ac, double descuento_ac, double monto_ac) {

        RnRegContaCab regla_movinvendet = new RnRegContaCab(path);

        return regla_movinvendet.eliminar(id_movinventario, codItem, afecto_ac, no_afecto_ac, igv_ac, descuento_ac, monto_ac, usuario.getId_usuario());
    }

    public void calcularImportes() {
        txtMAfecto.setText("0.0");
        txtMDescuento.setText("0.0");
        txtMIgv.setText("0.0");
        txtMNoAfecto.setText("0.0");
        txtMonto.setText("0.0");

        double totalPedido = 0.0;
        double descuentoPedido = 0.0;
        double afectoPedido = 0.0;
        double noafectoPedido = 0.0;
        double igvPedido = 0.0;

        for (int i = 0; i < modeltable.getRowCount(); i++) {
            ContaItem ordencompradet = modeltable.getDocumentoVentaDet(i);

            afectoPedido = afectoPedido + ordencompradet.getM_afecto();
            noafectoPedido = noafectoPedido + ordencompradet.getM_noafecto();
            descuentoPedido = descuentoPedido + ordencompradet.getM_descuento();
            igvPedido = igvPedido + ordencompradet.getM_igv();
        }

        double afectoRedondeado = CFunciones.redondea(afectoPedido, 2);
        double noafectoRedondeado = CFunciones.redondea(noafectoPedido, 2);
        double igvRedondeado = CFunciones.redondea(igvPedido, 2);
        double descuentoRedondeado = CFunciones.redondea(descuentoPedido, 2);

        txtMAfecto.setText(String.valueOf(afectoRedondeado));
        txtMNoAfecto.setText(String.valueOf(noafectoRedondeado));
        txtMIgv.setText(String.valueOf(igvRedondeado));
        txtMDescuento.setText(String.valueOf(descuentoRedondeado));

        totalPedido = noafectoPedido + afectoPedido + igvPedido;

        double montoTotalRedondeado = CFunciones.redondea(totalPedido, 2);

        txtMonto.setText(String.valueOf(montoTotalRedondeado));
    }

    @Override
    public boolean executeDelete() {
        try {
            RnRegContaCab regla = new RnRegContaCab(path);
            ContaCab m = new ContaCab();
            m.setIdMovimiento(txt_idmovimientoorigen.getText().trim());
            m.setIdTipoMov(txt_tipomov.getText().trim());
            m.setIdUsuario(usuario.getId_usuario());
            m.setIdRegcontaDoc1(txtCodRegContaCab1.getText().trim());
            return regla.eliminarSalidaOrdenRecojo(m);
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
            JOptionPane.showMessageDialog(null, ex.getMessage());
            return false;
        } finally {
            try {
                (new LogicStock(path)).regularizarStock(Main.anio);
                System.out.println(Main.anio);
            } catch (ClassNotFoundException ex) {
                System.err.println(ex.getLocalizedMessage());
            } catch (InstantiationException ex) {
                System.err.println(ex.getLocalizedMessage());
            } catch (IllegalAccessException ex) {
                System.err.println(ex.getLocalizedMessage());
            } catch (Exception ex) {
                System.err.println(ex.getLocalizedMessage());
            }
        }
    }

    @Override
    public String executeUpdate() {
        return "";
    }

    @Override
    public boolean executeAnular() {
        try {
            ContaCab m = new ContaCab();
            m.setIdMovimiento(txt_idmovimientoorigen.getText().trim());
            m.setIdTipoMov(txt_tipomov.getText().trim());
            m.setIdUsuario(usuario.getId_usuario());
            m.setIdRegcontaDoc1(txtCodRegContaCab1.getText().trim());
            RnMovInventarioCab logic = new RnMovInventarioCab(path);
            return logic.anularSalidaOrdenRecojo(m);
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(null, ex.getMessage());
            return false;
        } finally {
            this.regularizarStock();
        }
    }

    private void regularizarStock() {
        try {
            (new LogicStock(path)).regularizarStock(Main.anio);
        } catch (InstantiationException ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        } catch (IllegalAccessException ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        boolean isSelect;

        isSelect = (e.getStateChange() == ItemEvent.SELECTED);

        if (e.getItemSelectable() == check) {
            for (int i = 0; i < modeltable.getRowCount(); i++) {
                modeltable.getDocumentoVentaDet(i).setSeleccionado(isSelect);
                modeltable.getDocumentoVentaDet(i).setCantidad_despachar(modeltable.getDocumentoVentaDet(i).isSeleccionado() ? String.valueOf(modeltable.getDocumentoVentaDet(i).getTransito()) : "");
            }

            modeltable.fireTableDataChanged();
        }
    }

    @Override
    public void onPressEsc() {
    }

    @Override
    public void internalFrameOpened(InternalFrameEvent e) {
    }

    @Override
    public void internalFrameClosing(InternalFrameEvent e) {
    }

    @Override
    public void internalFrameClosed(InternalFrameEvent e) {
    }

    @Override
    public void internalFrameIconified(InternalFrameEvent e) {
    }

    @Override
    public void internalFrameDeiconified(InternalFrameEvent e) {
    }

    @Override
    public void internalFrameActivated(InternalFrameEvent e) {
    }

    @Override
    public void internalFrameDeactivated(InternalFrameEvent e) {
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
    public void showMessageErrorDelete() {
    }

    @Override
    public boolean executeSelect() {
        return true;
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }
}
