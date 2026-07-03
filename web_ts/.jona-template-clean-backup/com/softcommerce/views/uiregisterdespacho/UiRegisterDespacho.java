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

    protected CComboBox cbo_serie;
    protected List<UsuarioCorrelativo> x_serie;
    protected CComboBox cbo_idtipodoc;
    protected List<BeanTipoDocVenta> xTipoDocVenta;
    protected CComboBox cbo_idalmacen;
    protected List<Almacen> xalmacen;
    protected CComboBox cbo_idlocalidad;
    protected List<Localidad> xlocali;
    protected CComboBox cbo_idpuntoventa;
    protected List<PuntoVenta> xpuntoventa;
    protected CComboBox cbo_idempresa;
    protected List<Empresa> xempres;
    protected CComboBox cbMoneda;
    protected List<BeanMoneda> xmoneda = new ArrayList();
    protected JDateChooser dc_fechaemision;
    protected JTextField txt_idmovimientoorigen;
    protected JTextField txtTipoCambio;
    protected JTextField txt_serieref;
    protected JTextField txt_preimpresoref;
    protected JTextField txt_preimpreso;
    protected JTextField txtRazonSocial;
    protected JTextField txtCodCliente;
    protected JTextField txtRuc;
    protected JTextField txtMNoAfecto;
    protected JTextField txtMDescuento;
    protected JTextField txtMIgv;
    protected JTextField txtMAfecto;
    protected JTextField txtMonto;
    protected JTextField txtCodRegContaCab1;
    protected JTextField txtCodPuntoVenta;
    protected JTextField txt_idtipodoc;
    protected JTextField txt_idtipomovimiento;
    protected JTextField txt_tipomov;
    protected JTextField txt_idestado;
    protected JTextField txt_idpuntoventa;
    protected Usuario usuario;
    protected JLabel lblRazonSocial;
    protected JLabel lbl_RucCliente;
    protected JButton btn_buscardocumento;
    protected JTabbedPane tabb;
    protected DocumentoVentaDetalleTableModel modeltable;
    protected CTable tbl;
    protected JFrame frm;
    protected JPanel pnlCabezera;
    protected JCheckBox check;
    protected final Logger logger = Logger.getLogger(UiRegisterDespacho.class);

    public UiRegisterDespacho(String title, Usuario usuario, JFrame frm) {
        super(title);
        this.usuario = usuario;
        this.frm = frm;
        inicialize();
    }

    protected void inicialize() {
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
    }

    public void loadTipoDocumento() {
    }

    public void loadSerieCorrelativo(String id_tipodoc) {
    }

    public void loadEmpresa() {
    }

    public void loadMoneda() {
    }

    public void loadLocalidad(String xcodEmpres) {
    }

    public void loadPuntoVenta(String xcodLocalidad) {
    }

    public void loadAlmacen(String xcodPuntoVenta) {
    }

    @Override
    public void newRegister() {
    }

    @Override
    public String executeInsert() {
        return null;
    }

    protected void regularizarDocumento(String idMovInventarioCab, ContaItem item) {
    }

    protected boolean isValidDocument(List<ContaItem> lista, HashMap<String, List<ControlDoc>> listaDocumentosValidos)
            throws InstantiationException, IllegalAccessException, Exception {
        return false;
    }

    protected boolean isValidDocument(ContaItem item, ControlDoc doc) {
        return item.getId_item().equalsIgnoreCase(doc.getIdItemVenta())
                && item.getId_almacen().equalsIgnoreCase(doc.getIdAlmacenVenta())
                && item.getSerie().equalsIgnoreCase(doc.getSeriedoc())
                && item.getId_tipo_doc().equalsIgnoreCase(doc.getIdTipoDoc())
                && item.getPreimpreso().equalsIgnoreCase(doc.getPreimpresodoc());
    }

    protected HashMap<String, List<ControlDoc>> getDocumentosValidos(List<ContaItem> lista)
            throws InstantiationException, IllegalAccessException, Exception {
        return null;
    }

    protected boolean validarFechas(java.util.Date fechaInicio, java.util.Date fechaFin) {
        return false;
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
        return false;
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
    }

    public void cargarDocumentoVenta(List<ContaItem> m) {
    }

    protected void setTipoDocRef(String idTipoDoc) {
        System.out.println("idTipoDoc = " + idTipoDoc);
        cbo_idtipodoc.setSelectedIndex(this.getPosTipoDoc(idTipoDoc));
    }

    protected int getPosTipoDoc(String idTipoDoc) {
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
    }

    @Override
    public boolean loadRegister() {
        return false;
    }

    @Override
    public void setFecha(Date fechaInicio, Date fechaFin) {
        java.util.Date fechaEmision = new java.util.Date(Main.fechaActualServer.getTime());
        dc_fechaemision.setDate(fechaEmision);
        dc_fechaemision.setSelectableDateRange(((Main) frm).getFechaInicio(), fechaEmision);
    }

    public void cargarEmpresa(String xcodiEmpresa) {
    }

    public void cargarLocalidad(String xcodiLocalidad) {
    }

    public void cargarAlmacen(String xcodiEmpresa) {
    }

    public void cargarTipoDocumento(String codTipoMov) {
    }

    public void cargarMoneda(String codMoneda) {
    }

    public void cargarPuntoVenta(String codPuntoVenta) {
    }

    @Override
    public void setValueSearch(Object m, Component comp) {
    }

    @Override
    public void showMessagePrint(String codigo) {
    }

    public void mostrarPreimpreso() {
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
        return false;
    }

    public void calcularImportes() {
    }

    @Override
    public boolean executeDelete() {
        return false;
    }

    @Override
    public String executeUpdate() {
        return null;
    }

    @Override
    public boolean executeAnular() {
        return false;
    }

    protected void regularizarStock() {
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
        return false;
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }
}
