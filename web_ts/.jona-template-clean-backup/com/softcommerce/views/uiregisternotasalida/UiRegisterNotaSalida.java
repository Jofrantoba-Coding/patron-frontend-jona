package com.softcommerce.views.uiregisternotasalida;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.BeanAnexo;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.BeanMoneda;
import com.softcommerce.beans.Lote;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.enums.TipoAnexoEnum;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import com.softcommerce.general.controles.JHInternal;
import com.softcommerce.general.controles.CComboBox;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.herramientas.CTableFx;
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
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComponent;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.SwingConstants;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnLocalidad;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.general.tablas.DocumentoVentaDetalleTableModel;
import com.softcommerce.logic.LogicLote;
import com.softcommerce.logic.LogicStock;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.reglasnegocio.RnMovInventarioCab;
import com.softcommerce.reglasnegocio.RnStock;
import com.softcommerce.util.Constans;
import com.softcommerce.util.combo.LoadCombo;
import com.softcommerce.util.Util;
import com.softcommerce.util.editor.CellEditorBtnLoteVenta;
import java.awt.FlowLayout;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.math.BigDecimal;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.ListSelectionModel;

public class UiRegisterNotaSalida
        extends JHInternal
        implements InterUiRegisterNotaSalida, ActionListener, ItemListener, KeyListener, FocusListener, TableModelListener, MouseListener {

    private static final long serialVersionUID = 1L;
    protected Usuario usuario;
    protected Gif gif;
    protected Main frm;
    protected CComboBox cbo_serie;
    protected CComboBox cbo_idlocalidad;
    protected CComboBox cbo_idpuntoventa;
    protected CComboBox cbo_idalmacen;
    protected CComboBox cbo_idmoneda;
    protected List<Localidad> lst_localidad;
    protected List<PuntoVenta> lst_puntoventa;
    protected List<Almacen> lst_almacen;
    protected List<UsuarioCorrelativo> lst_serie;
    protected List<BeanMoneda> lst_moneda;
    protected JTextField txt_preimpreso;
    protected JTextField txtIdTipoDocRef;
    protected JTextField txt_serieref;
    protected JTextField txt_preimpresoref;
    protected JTextField txt_codcliente;
    protected JTextField txt_razonsocial;
    protected JTextField txt_ruc;
    protected JTextField txt_idordencompra;
    protected JTextField txt_tipocambio;
    protected JTextField txt_total;
    protected JTextField txt_percepcion;
    protected JTextField txt_noafecto;
    protected JTextField txt_igv;
    protected JTextField txt_afecto;
    protected JTextField txt_monto;
    protected JTextField txt_flagdetigv;
    protected JTextField txt_flagdescuento;
    protected JTextField txtIdTransportista;
    protected JTextField txtTransportista;
    protected JTextField txtNumeroTransportista;
    protected JTabbedPane tabb_notaSalida;
    protected JCheckBox chkSeleccionar;
    protected JTable tblNotaSalida;
    protected DocumentoVentaDetalleTableModel mdlNotaSalida;
    protected CellEditorBtnLoteVenta editorLote;
    protected JDateChooser dc_fechaemision;
    protected JButton btn_buscardocumento;

    public UiRegisterNotaSalida(String title, Usuario usuario, Main frm) {
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
        gif = new Gif();
        setRegister(this.getPnlPrincipal());
    }

    protected JPanel getPnlPrincipal() {
        JPanel pnlDialog = new JPanel();
        pnlDialog.setLayout(new BorderLayout());
        pnlDialog.setBackground(new Color(245, 245, 245));

        pnlDialog.add(this.getPnlCenter(), BorderLayout.CENTER);

        txt_flagdescuento = new JTextField();
        txt_flagdetigv = new JTextField();
        pnlDialog.add(this.getPnlNorth(), BorderLayout.NORTH);
        pnlDialog.add(this.getPnlSouth(), BorderLayout.SOUTH);
        return pnlDialog;
    }

    protected JPanel getPnlCenter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        tabb_notaSalida = new JTabbedPane();
        mdlNotaSalida = new DocumentoVentaDetalleTableModel();
        mdlNotaSalida.addTableModelListener(this);
        mdlNotaSalida.setIsChangeCantidadValueAt(false);
        tblNotaSalida = new JTable();
        tblNotaSalida.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tblNotaSalida.setFont(new Font("Helvetica", Font.BOLD, 14));
        //tblNotaSalida = new CTable();
        tblNotaSalida.setModel(mdlNotaSalida);
        /*tblVenta.getColumnModel().getColumn(7).setMinWidth(0);
        tblVenta.getColumnModel().getColumn(7).setMaxWidth(0);*/
        //tblNotaSalida.setAllColumnNoResizable();
        //tblNotaSalida.setAllTableNoEditable();
        if (Constans.ISBOTICA && !Constans.IS_NOTA_SALIDA_AUTOMATICO) {
            editorLote = new CellEditorBtnLoteVenta(mdlNotaSalida, this);
            tblNotaSalida.getColumnModel().getColumn(11).setCellEditor(editorLote);
            tblNotaSalida.getColumnModel().getColumn(11).setCellRenderer(editorLote);
        } else {
            //tblNotaSalida.setColumnEditor(11, new DigitTextFieldCellEditor(EnumClass.TipoDatoEditor.DOUBLE_EDITOR).cellEditor);
        }
        //tblNotaSalida.setAllColumnPreferredWidth();
        CTableFx.setAllColumnPreferredWidth(tblNotaSalida);
        tblNotaSalida.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        JScrollPane scrollTableguiaventa = new JScrollPane(tblNotaSalida);
        tabb_notaSalida.addTab("Item", scrollTableguiaventa);
        pnl.add(tabb_notaSalida, BorderLayout.CENTER);
        chkSeleccionar = new JCheckBox("Seleccionar Todo");
        chkSeleccionar.addItemListener(this);
        chkSeleccionar.setFont(new Font("Verdana", 1, 11));
        chkSeleccionar.addKeyListener(this);
        chkSeleccionar.setHorizontalTextPosition(SwingConstants.LEFT);
        chkSeleccionar.addFocusListener(this);
        chkSeleccionar.setOpaque(false);
        pnl.add(chkSeleccionar, BorderLayout.NORTH);
        return pnl;
    }

    protected JPanel getPnlNorth() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnlPrinc.add(pnl, BorderLayout.WEST);
        pnl.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.anchor = GridBagConstraints.WEST;
        gbc.insets = new Insets(2, 2, 2, 2);

        CLabel lbl_serie = new CLabel("N° Salida");
        pnl.add(lbl_serie, gbc);

        gbc.gridx = 1;
        gbc.insets = new Insets(2, 2, 2, 0);
        cbo_serie = new CComboBox();
        cbo_serie.setFont(new Font(Font.SANS_SERIF, 0, 9));
        cbo_serie.addKeyListener(this);
        cbo_serie.addActionListener(this);
        pnl.add(cbo_serie, gbc);

        gbc.gridx = 2;
        gbc.gridwidth = 2;
        txt_preimpreso = new JTextField();
        txt_preimpreso.setFont(new Font(Font.SANS_SERIF, Font.BOLD | Font.ITALIC, 12));
        txt_preimpreso.setForeground(Color.BLACK);
        txt_preimpreso.setColumns(8);
        txt_preimpreso.setEditable(false);
        gbc.insets = new Insets(2, 0, 2, 2);
        pnl.add(txt_preimpreso, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 4;
        gbc.insets = new Insets(2, 2, 2, 2);
        CLabel lbl_fechaemision = new CLabel("F Emision");
        pnl.add(lbl_fechaemision, gbc);

        gbc.gridx = 5;
        dc_fechaemision = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextFieldDateEditor) dc_fechaemision.getDateEditor()).addFocusListener(this);
        ((JTextFieldDateEditor) dc_fechaemision.getDateEditor()).addKeyListener(this);
        dc_fechaemision.getJCalendar().addMouseListener(this);
        dc_fechaemision.getJCalendar().addFocusListener(this);
        dc_fechaemision.getJCalendar().addKeyListener(this);
        dc_fechaemision.getCalendarButton().addMouseListener(this);
        dc_fechaemision.getCalendarButton().addActionListener(this);
        dc_fechaemision.addMouseListener(this);
        dc_fechaemision.addKeyListener(this);
        dc_fechaemision.addFocusListener(this);
        ((JTextField) dc_fechaemision.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                chkSeleccionar.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dc_fechaemision.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_fechaemision.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        pnl.add(dc_fechaemision, gbc);

        gbc.gridx = 6;
        btn_buscardocumento = new JButton("F5", gif.SEARCH16);
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
        pnl.add(this.btn_buscardocumento, gbc);

        gbc.gridx = 7;
        CLabel lbl_serieref = new CLabel("Referencia");
        pnl.add(lbl_serieref, gbc);

        gbc.gridx = 8;
        gbc.gridwidth = 2;
        gbc.insets = new Insets(2, 2, 2, 0);
        txt_idordencompra = new JTextField();
        txt_idordencompra.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_idordencompra.setForeground(Color.BLACK);
        txt_idordencompra.setColumns(8);
        txt_idordencompra.setEditable(false);
        pnl.add(txt_idordencompra, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 10;
        gbc.insets = new Insets(2, 0, 2, 0);
        txtIdTipoDocRef = new JTextField();
        txtIdTipoDocRef.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txtIdTipoDocRef.setForeground(Color.BLACK);
        txtIdTipoDocRef.setColumns(2);
        txtIdTipoDocRef.setEditable(false);
        pnl.add(txtIdTipoDocRef, gbc);

        gbc.gridx = 11;
        gbc.insets = new Insets(2, 0, 2, 0);
        txt_serieref = new JTextField();
        txt_serieref.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_serieref.setForeground(Color.BLACK);
        txt_serieref.setColumns(3);
        txt_serieref.setEditable(false);
        pnl.add(txt_serieref, gbc);

        gbc.gridx = 12;
        gbc.insets = new Insets(2, 0, 2, 2);
        txt_preimpresoref = new JTextField();
        txt_preimpresoref.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_preimpresoref.setForeground(Color.BLACK);
        txt_preimpresoref.setColumns(8);
        txt_preimpresoref.setEditable(false);
        pnl.add(txt_preimpresoref, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.insets = new Insets(2, 2, 2, 2);
        CLabel lbl_localidad = new CLabel("Localidad");
        pnl.add(lbl_localidad, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 3;
        cbo_idlocalidad = new CComboBox();
        cbo_idlocalidad.setFont(new Font(Font.SANS_SERIF, 0, 9));
        cbo_idlocalidad.addActionListener(this);
        cbo_idlocalidad.setEnabled(false);
        cbo_idlocalidad.addKeyListener(this);
        pnl.add(cbo_idlocalidad, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 4;
        CLabel lbl_puntoventa = new CLabel("P Venta");
        pnl.add(lbl_puntoventa, gbc);

        gbc.gridx = 5;
        gbc.gridwidth = 3;
        cbo_idpuntoventa = new CComboBox();
        cbo_idpuntoventa.setFont(new Font(Font.SANS_SERIF, 0, 11));
        cbo_idpuntoventa.addActionListener(this);
        cbo_idpuntoventa.setEnabled(false);
        cbo_idpuntoventa.addKeyListener(this);
        pnl.add(cbo_idpuntoventa, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 8;
        CLabel lbl_almacen = new CLabel("Almacen");
        pnl.add(lbl_almacen, gbc);

        gbc.gridx = 9;
        gbc.gridwidth = 4;
        cbo_idalmacen = new CComboBox();
        cbo_idalmacen.setFont(new Font(Font.SANS_SERIF, 0, 11));
        cbo_idalmacen.addActionListener(this);
        cbo_idalmacen.addKeyListener(this);
        cbo_idalmacen.setEnabled(false);
        pnl.add(cbo_idalmacen, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 2;
        CLabel lblRazonSocial = new CLabel("R Social");
        pnl.add(lblRazonSocial, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 2;
        gbc.insets = new Insets(2, 2, 2, 0);
        txt_codcliente = new JTextField();
        txt_codcliente.setEditable(false);
        txt_codcliente.setColumns(8);
        pnl.add(txt_codcliente, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 3;
        gbc.gridwidth = 3;
        gbc.insets = new Insets(2, 0, 2, 2);
        txt_razonsocial = new JTextField();
        txt_razonsocial.setEditable(false);
        txt_razonsocial.setColumns(25);
        pnl.add(txt_razonsocial, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 6;
        gbc.insets = new Insets(2, 2, 2, 2);
        CLabel lbl_RucCliente = new CLabel("RUC/DNI");
        pnl.add(lbl_RucCliente, gbc);

        gbc.gridx = 7;
        gbc.gridwidth = 2;
        txt_ruc = new JTextField();
        txt_ruc.setEditable(false);
        txt_ruc.setColumns(8);
        pnl.add(txt_ruc, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 9;
        gbc.gridwidth = 2;
        CLabel lbl_moneda = new CLabel("Moneda");
        pnl.add(lbl_moneda, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 11;
        gbc.gridwidth = 2;
        cbo_idmoneda = new CComboBox();
        cbo_idmoneda.setFont(new Font(Font.SANS_SERIF, 0, 11));
        cbo_idmoneda.addActionListener(this);
        cbo_idmoneda.addKeyListener(this);
        cbo_idmoneda.setEnabled(false);
        pnl.add(cbo_idmoneda, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 3;
        CLabel lblTransportista = new CLabel("Transportista");
        pnl.add(lblTransportista, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 2;
        gbc.insets = new Insets(2, 2, 2, 0);
        txtIdTransportista = new JTextField();
        txtIdTransportista.setEditable(false);
        txtIdTransportista.setColumns(8);
        pnl.add(txtIdTransportista, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 3;
        gbc.gridwidth = 3;
        gbc.insets = new Insets(2, 0, 2, 2);
        txtTransportista = new JTextField();
        txtTransportista.setEditable(false);
        txtTransportista.setColumns(25);
        pnl.add(txtTransportista, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 6;
        gbc.insets = new Insets(2, 2, 2, 2);
        CLabel lblNumeroTransportista = new CLabel("RUC/DNI");
        pnl.add(lblNumeroTransportista, gbc);

        gbc.gridx = 7;
        gbc.gridwidth = 2;
        txtNumeroTransportista = new JTextField();
        txtNumeroTransportista.setEditable(false);
        txtNumeroTransportista.setColumns(8);
        pnl.add(txtNumeroTransportista, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 9;
        gbc.gridwidth = 2;
        CLabel lbl_tipocambio = new CLabel("TC");
        pnl.add(lbl_tipocambio, gbc);

        gbc.gridx = 11;
        txt_tipocambio = new JTextField();
        txt_tipocambio.setEditable(false);
        txt_tipocambio.setColumns(3);
        pnl.add(txt_tipocambio, gbc);
        gbc.gridwidth = 1;

        return pnlPrinc;
    }

    protected JPanel getPnlSouth() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnl = new JPanel(new FlowLayout(FlowLayout.LEADING, 2, 5));
        pnlPrinc.add(pnl, BorderLayout.CENTER);
        CLabel lblMAfecto = new CLabel("Afecto");
        pnl.add(lblMAfecto);

        txt_afecto = new JTextField();
        txt_afecto.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_afecto.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txt_afecto.addKeyListener(this);
        txt_afecto.setEditable(false);
        txt_afecto.setColumns(8);
        pnl.add(txt_afecto);

        CLabel lblMNoAfecto = new CLabel("No Afecto");
        pnl.add(lblMNoAfecto);

        txt_noafecto = new JTextField();
        txt_noafecto.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_noafecto.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txt_noafecto.addKeyListener(this);
        txt_noafecto.setEditable(false);
        txt_noafecto.setColumns(8);
        pnl.add(txt_noafecto);

        CLabel lblMIgv = new CLabel("Igv");
        pnl.add(lblMIgv);

        txt_igv = new JTextField();
        txt_igv.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_igv.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txt_igv.addKeyListener(this);
        txt_igv.setEditable(false);
        txt_igv.setColumns(8);
        pnl.add(txt_igv);

        CLabel lblMonto = new CLabel("Monto");
        pnl.add(lblMonto);

        txt_monto = new JTextField();
        txt_monto.addKeyListener(this);
        txt_monto.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txt_monto.setEditable(false);
        txt_monto.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_monto.setForeground(Color.RED);
        txt_monto.setColumns(8);
        pnl.add(txt_monto);

        CLabel lblMPercepcion = new CLabel("Perc");
        pnl.add(lblMPercepcion);

        txt_percepcion = new JTextField();
        txt_percepcion.setBounds(700, 390, 90, 25);
        txt_percepcion.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_percepcion.addKeyListener(this);
        txt_percepcion.setForeground(Color.BLUE);
        txt_percepcion.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txt_percepcion.setEditable(false);
        txt_percepcion.setColumns(8);
        pnl.add(txt_percepcion);

        CLabel lblTotal = new CLabel("Total");
        pnl.add(lblTotal);

        txt_total = new JTextField();
        txt_total.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_total.addKeyListener(this);
        txt_total.setForeground(Color.darkGray);
        txt_total.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txt_total.setEditable(false);
        txt_total.setColumns(8);
        pnl.add(txt_total);
        return pnlPrinc;
    }

    @Override
    public void loadCombo() {
    }

    public void loadLocalidad() {
    }

    public void loadPuntoVenta(String xcodLocalidad) {
    }

    public void loadAlmacen(String xcodPuntoventa) {
    }

    public void mostrarPreimpreso() {
    }

    public void loadSerie() {
    }

    public void loadMoneda() {
    }

    @Override
    public void newRegister() {
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (btn_buscardocumento == e.getSource()) {
            BuscarOrdenCompraSalidaAjuste buscarOrdenRecojo = new BuscarOrdenCompraSalidaAjuste(frm, this, usuario, path);
            buscarOrdenRecojo.cargarTabla(btn_buscardocumento);
        }

        if (cbo_idlocalidad == e.getSource()) {
            if (cbo_idlocalidad.getItemCount() > 0) {
                if (cbo_idlocalidad.getSelectedIndex() == 0) {
                    cbo_idpuntoventa.removeAllItems();
                    cbo_idalmacen.removeAllItems();
                } else {
                    loadPuntoVenta(lst_localidad.get(cbo_idlocalidad.getSelectedIndex() - 1).getId_localidad());
                }
            }
        }

        if (cbo_idpuntoventa == e.getSource()) {
            if (cbo_idpuntoventa.getItemCount() > 0) {
                if (cbo_idpuntoventa.getSelectedIndex() == 0) {
                    cbo_idalmacen.removeAllItems();
                } else {
                    loadAlmacen(lst_puntoventa.get(cbo_idpuntoventa.getSelectedIndex() - 1).getId_punto_venta());
                }
            }
        }

        if (cbo_serie == e.getSource() && mode == INSERT) {
            if (cbo_serie.getSelectedIndex() > -1) {
                mostrarPreimpreso();
            }
        }
    }

    public void cargarLocalidad(String xcodiLocalidad) {
    }

    public void cargarPuntoVenta(String codPuntoVenta) {
    }

    public void cargarAlmacen(String xcodiEmpresa) {
    }

    public void cargarMoneda(String xcodiEmpresa) {
    }

    public void cargarDocumentoVenta(List<ContaItem> m) {
    }

    protected void loadDataTransportista(String idTransportista) {
    }

    @Override
    @SuppressWarnings("unchecked")
    public void setValueSearch(Object m, Component comp) {
        if (comp == btn_buscardocumento) {
            cargarDocumentoVenta((List<ContaItem>) m);
        }
        if (comp.equals(chkSeleccionar)) {
            editorLote.stopCellEditing();
            /*ContaItem beanGuia = (ContaItem) m;
            mdlNotaSalida.reloadLotes(beanGuia);*/
            mdlNotaSalida.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(tblNotaSalida);
        }
    }

    protected void regularizarStock() {
    }

    protected void setLoteDetalles() throws Exception {
        try {
            if (!Constans.ISBOTICA) {
                return;
            }
            if (!Constans.IS_NOTA_SALIDA_AUTOMATICO) {
                return;
            }
            for (ContaItem contaItem : mdlNotaSalida.getData()) {
                contaItem.setListaLotes(this.getLotesInsertar(contaItem));
            }
        } catch (Exception e) {
            throw e;
        }
    }

    protected ArrayList<Lote> getLotesInsertar(ContaItem contaItem) throws Exception {
        try {
            BigDecimal cantidad = Util.getNumberBigDecimal(contaItem.getCantidad_despachar());
            List<Lote> lotes = this.getLotes(contaItem);
            ArrayList<Lote> result = new ArrayList();
            for (Lote lote : lotes) {
                if (cantidad.compareTo(BigDecimal.ZERO) != 1) {
                    break;
                }
                if (cantidad.compareTo(lote.getSaldo()) == 1) {
                    cantidad = cantidad.subtract(lote.getSaldo());
                    lote.setCantidadOrigen(lote.getSaldo());
                } else {
                    lote.setCantidadOrigen(cantidad);
                    cantidad = BigDecimal.ZERO;
                }
                result.add(lote);
            }
            if (cantidad.compareTo(BigDecimal.ZERO) == 1) {
                throw new Exception("Item " + contaItem.getId_item() + ", no tiene suficiente stock en lotes");
            }
            return result;
        } catch (Exception e) {
            throw e;
        }
    }

    protected List<Lote> getLotes(ContaItem contaItem) throws Exception {
        return null;
    }

    protected ContaCab getContaCab() throws Exception {
        try {
            ContaCab m = new ContaCab();
            m.setIdEmpresa(usuario.getCodempresa());
            m.setIdLocalidad(usuario.getCodlocalidad());
            m.setIdPuntoventa(usuario.getCodpuntoventa());
            m.setSerie(lst_serie.get(cbo_serie.getSelectedIndex()).getSerie());
            m.setIdAlmacen(cbo_idalmacen.getSelectedIndex() > 0 ? lst_almacen.get(cbo_idalmacen.getSelectedIndex() - 1).getIdAlmacen() : "");
            m.setPreimpreso(txt_preimpreso.getText().trim());
            m.setFEmision(dc_fechaemision.getDate());
            m.setFTraslado(dc_fechaemision.getDate());
            m.setIdUsuario(usuario.getId_usuario());
            m.setAnIdanexo(txt_codcliente.getText().trim());
            m.setOcIdordencompra(txt_idordencompra.getText().trim());
            m.setOcIdtipodoc("OC");
            m.setOcSerie(txt_serieref.getText().trim());
            m.setOcPreimpreso(txt_preimpresoref.getText().trim());
            this.setLoteDetalles();
            m.setMovDet(mdlNotaSalida.getData());
            m.setIdMoneda(cbo_idmoneda.getSelectedIndex() > 0 ? lst_moneda.get(cbo_idmoneda.getSelectedIndex() - 1).getIdMoneda() : "");
            m.setMTipoCambio(txt_tipocambio.getText().trim().equals("") ? 0.0 : Double.valueOf(txt_tipocambio.getText().trim()));
            m.setMAfecto(Double.valueOf(txt_afecto.getText().trim()));
            m.setMNoafecto(Double.valueOf(txt_noafecto.getText().trim()));
            m.setMonto(Double.valueOf(txt_monto.getText().trim()));
            m.setTotal(Double.valueOf(txt_total.getText().trim()));
            m.setMIgv(Double.valueOf(txt_igv.getText().trim()));
            m.setIdAnexoTransportista(txtIdTransportista.getText().trim());
            m.setFlagDescuento(txt_flagdescuento.getText().trim());
            m.setFlagigv(txt_flagdetigv.getText().trim());
            m.setIdCorrelativo(lst_serie.get(cbo_serie.getSelectedIndex()).getIdCorrelativo());
            return m;
        } catch (Exception e) {
            throw e;
        }
    }

    @Override
    public String executeInsert() {
        return null;
    }

    public void executeAgregar(ActionEvent e) {
    }

    @Override
    public void tableChanged(TableModelEvent e) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
    }

    public void executeQuitar(Object ob, ActionEvent e) {
    }

    public void executeEditar(Object ob, ActionEvent e) {
    }

    public void executeEditar(Object ob, MouseEvent e) {
    }

    public void executeDetalle(Object ob, ActionEvent E) {
    }

    public void executeExit() {
    }

    public void onFocusOKB(int boton) {
    }

    public void addRow(Object[] ob, Component comp, int modo) {
    }

    public void removeRow(Object ob, Component comp, int modo) {
    }

    public void updateRow(Object[] ob, Component comp, int modo) {
    }

    @Override
    public boolean executeAnular() {
        return false;
    }

    @Override
    public String executeUpdate() {
        return null;
    }

    @Override
    public void onPressEsc() {
    }

    @Override
    public boolean executeDelete() {
        return false;
    }

    public boolean executeDetail() {
        return false;
    }

    public void prepareRegister() {
    }

    public void showSearchDialog() {
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

    public boolean showConfirmDelete() {
        return false;
    }

    @Override
    public boolean executeSelect() {
        return false;
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
    }

    @Override
    public void keyTyped(KeyEvent e) {
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

    public void onClickQuitar(ActionEvent E) {
    }

    public void onClickAgregar(ActionEvent e) {
    }

    public void onClickEditar(ActionEvent E) {
    }

    public void onClickDetalle(ActionEvent E) {
    }

    public void onFocusOKT(int button) {
    }

    @Override
    public void showMessagePrint(String codigo) {
    }

    @Override
    public void setRegisterEnabled(boolean e) {
    }

    @Override
    public void setRegisterEditable(boolean e) {
    }

    @Override
    public boolean loadRegister() {
        return false;
    }

    @Override
    public boolean isRegisterValid() {
        return false;
    }

    protected boolean validateBotica() {
        if (!Constans.ISBOTICA) {
            return true;
        }
        if (!Constans.IS_NOTA_SALIDA_AUTOMATICO){
            return true;
        }
        this.regularizarStock();
        return this.validateItem();
    }

    protected boolean validateItem() {
        return false;
    }

    protected boolean validateItem(ContaItem contaItem) {
        BigDecimal stock = this.getStockByItemAlmacen(contaItem);
        BigDecimal cantidadDespachar = new BigDecimal(contaItem.getCantidad_despachar());
        return cantidadDespachar.compareTo(stock) != 1;
    }

    protected BigDecimal getStockByItemAlmacen(ContaItem contaItem) {
        return null;
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

    public JCheckBox getChkSeleccionar() {
        return chkSeleccionar;
    }

}
