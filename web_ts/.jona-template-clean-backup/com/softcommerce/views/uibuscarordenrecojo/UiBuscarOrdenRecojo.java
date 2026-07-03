package com.softcommerce.views.uibuscarordenrecojo;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.BeanFamilia;
import com.softcommerce.beans.BeanMarca;
import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.BeanSubFamilia;
import com.softcommerce.beans.BeanTipoDocVenta;
import com.softcommerce.beans.Usuario;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import com.softcommerce.general.controles.CDialog;
import com.softcommerce.general.controles.JHInternal;
import com.softcommerce.general.controles.CComboBox;
import com.softcommerce.iconos.Gif;
import java.awt.Color;
import java.awt.Component;
import java.awt.Font;
import java.awt.Frame;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.ItemEvent;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.SwingConstants;
import javax.swing.border.EmptyBorder;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.CuadroMensaje;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.event.FocusListener;
import java.awt.event.ItemListener;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.swing.JCheckBox;
import javax.swing.JComponent;
import javax.swing.JOptionPane;
import javax.swing.KeyStroke;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.reglasnegocio.RnFamilia;
import com.softcommerce.reglasnegocio.RnMarca;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.reglasnegocio.RnSubFamilia;
import com.softcommerce.general.tablas.DocumentoVentaDetalleTableModel;
import com.softcommerce.reglasnegocio.RnTipoDocVenta;
import com.softcommerce.util.FormatObject;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.net.URL;

public class UiBuscarOrdenRecojo
        extends CDialog 
        implements InterUiBuscarOrdenRecojo, ActionListener, KeyListener, WindowListener, ItemListener, FocusListener {

    private static final long serialVersionUID = 1L;
    protected Component comp;
    protected DocumentoVentaDetalleTableModel modeltable;
    protected CTable tblSearch;
    protected JScrollPane scrollSearch;
    protected JButton btnAgregar;
    protected JButton cbCancel;
    protected JButton btnBuscarDocumento;
    protected JComboBox cbo_idtipodoc;
    protected JComboBox cbo_idestado;
    protected JTextField txt_idanexo;
    protected JTextField txt_serie;
    protected JTextField txt_preimpreso;
    protected JTextField txt_ruc;
    protected JTextField txt_tmprazonsocial;
    protected JTextField txt_idregconta;
    protected JDateChooser dc_fechainicio;
    protected JDateChooser dc_fechafin;
    protected JHInternal arg;
    protected JTextField txt_iditem;
    protected JTextField txt_descripcionitem;
    protected List<BeanMarca> xmarca;
    protected JComboBox cbo_idmarca;
    protected List<BeanSubFamilia> xSubFamiliaFiltro;
    protected JComboBox cbo_idsubfamilia;
    protected List<BeanFamilia> xfamilia;
    protected JComboBox cbo_idfamilia;
    protected Usuario usuario;
    protected CComboBox cbo_idalmacen;
    protected List<Almacen> xalmacen;
    protected JCheckBox check;
    protected JCheckBox chk_documento;
    protected JCheckBox chk_cliente;
    protected CuadroMensaje cuadro;
    protected Gif gif;
    protected List<BeanTipoDocVenta> xTipoDocVenta;

    public UiBuscarOrdenRecojo(Frame arg0, JHInternal pnlguia, Usuario usuario, URL path) {
        super(arg0);
        this.path = path;
        this.arg = pnlguia;
        this.usuario = usuario;
        cuadro = new CuadroMensaje(this.usuario);
        initialize();
    }

    protected void initialize() {
        addWindowListener(this);

        gif = new Gif();

        JPanel pnl = new JPanel();
        pnl.setBackground(new Color(243, 248, 252));
        pnl.setBorder(new EmptyBorder(5, 5, 5, 5));
        pnl.setFocusable(false);
        pnl.setOpaque(false);
        pnl.setLayout(new BorderLayout());

        pnl.add(getPnlNorth(), BorderLayout.NORTH);
        pnl.add(getPnlSouth(), BorderLayout.SOUTH);
        pnl.add(getPnlCenter(), BorderLayout.CENTER);

        this.loadCombo();

        setBackground(new Color(245, 245, 245));
        setTitle("Buscar Documento de Venta - UiBuscarOrdenRecojo");
        setContentPane(pnl);
        setModal(true);
        setResizable(true);
        setSize(880, 440);
        ComponentToolKit.centerComponentPosicion(this);
    }

    protected void loadCombo() {
    }

    protected void loadTipoDocumento() throws Exception {
    }

    protected JPanel getPnlNorth() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        pnlPrinc.add(this.getPnlBuscarPor(), BorderLayout.NORTH);
        pnlPrinc.add(this.getPnlFiltros(), BorderLayout.CENTER);
        return pnlPrinc;
    }

    protected JPanel getPnlFiltros() {
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

        JLabel lblSerie = new JLabel("Documento");
        pnl.add(lblSerie, gbc);

        gbc.gridx = 1;

        txt_idregconta = new JTextField();
        txt_idregconta.setColumns(7);
        txt_idregconta.addKeyListener(this);
        txt_idregconta.setDocument(new IntegerDocument(10));
        txt_idregconta.addFocusListener(this);
        txt_idregconta.setFont(new Font("Garamond", 0, 14));
        pnl.add(txt_idregconta, gbc);

        gbc.gridx = 2;
        gbc.insets = new Insets(2, 2, 2, 0);
        cbo_idtipodoc = new JComboBox();
        cbo_idtipodoc.addActionListener(this);
        cbo_idtipodoc.addKeyListener(this);
        pnl.add(cbo_idtipodoc, gbc);

        gbc.gridx = 3;
        gbc.insets = new Insets(2, 0, 2, 0);
        txt_serie = new JTextField();
        txt_serie.addKeyListener(this);
        txt_serie.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_serie.addFocusListener(this);
        FormatObject.formatJTextFieldSerie(txt_serie);
        txt_serie.setForeground(Color.BLACK);
        pnl.add(txt_serie, gbc);

        gbc.gridx = 4;
        txt_preimpreso = new JTextField();
        txt_preimpreso.addKeyListener(this);
        txt_preimpreso.setColumns(7);
        txt_preimpreso.setFont(new Font("Garamond", 0, 11));
        txt_preimpreso.addFocusListener(this);
        txt_preimpreso.setDocument(new IntegerDocument(10));
        txt_preimpreso.setForeground(Color.BLACK);
        gbc.insets = new Insets(2, 0, 2, 2);
        pnl.add(txt_preimpreso, gbc);

        gbc.gridx = 5;
        gbc.insets = new Insets(2, 2, 2, 2);
        JLabel lblFechaInicio = new JLabel("Fec Inicio");
        lblFechaInicio.setDisplayedMnemonic('c');
        pnl.add(lblFechaInicio, gbc);

        gbc.gridx = 6;
        dc_fechainicio = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).addFocusListener(this);
        dc_fechainicio.getJCalendar().addFocusListener(this);
        dc_fechainicio.getJCalendar().addKeyListener(this);
        dc_fechainicio.getCalendarButton().addActionListener(this);
        dc_fechainicio.addKeyListener(this);
        dc_fechainicio.addFocusListener(this);
        ((JTextField) dc_fechainicio.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dc_fechainicio.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_fechainicio.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        dc_fechainicio.setDate(DateTime.format(100, 0, 1));
        pnl.add(dc_fechainicio, gbc);

        gbc.gridx = 7;
        JLabel lblFechaFin = new JLabel("Fec Fin");
        lblFechaFin.setDisplayedMnemonic('a');
        pnl.add(lblFechaFin, gbc);

        gbc.gridx = 8;
        dc_fechafin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).addFocusListener(this);
        dc_fechafin.getJCalendar().addFocusListener(this);
        dc_fechafin.getJCalendar().addKeyListener(this);
        dc_fechafin.getCalendarButton().addActionListener(this);
        dc_fechafin.addKeyListener(this);
        dc_fechafin.addFocusListener(this);
        ((JTextField) dc_fechafin.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                cbo_idestado.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dc_fechafin.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_fechafin.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        dc_fechafin.setDate(new Date());
        pnl.add(dc_fechafin, gbc);

        gbc.gridx = 9;
        JLabel lbl_estado = new JLabel("Est");
        lbl_estado.setFont(new Font("Verdana", 0, 11));
        pnl.add(lbl_estado, gbc);

        gbc.gridx = 10;
        cbo_idestado = new JComboBox();
        cbo_idestado.addItem("T");
        cbo_idestado.addItem("PEN");
        cbo_idestado.addItem("PAA");
        cbo_idestado.addActionListener(this);
        cbo_idestado.addKeyListener(this);
        pnl.add(cbo_idestado, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblRazonSocial = new JLabel("R. Social");
        pnl.add(lblRazonSocial, gbc);

        gbc.gridx = 1;
        gbc.insets = new Insets(2, 2, 2, 0);
        txt_idanexo = new JTextField();
        txt_idanexo.addFocusListener(this);
        txt_idanexo.addKeyListener(this);
        txt_idanexo.setColumns(7);
        pnl.add(txt_idanexo, gbc);

        gbc.gridx = 2;
        gbc.gridwidth = 5;
        gbc.insets = new Insets(2, 0, 2, 2);
        gbc.fill = GridBagConstraints.HORIZONTAL;
        txt_tmprazonsocial = new JTextField();
        txt_tmprazonsocial.addKeyListener(this);
        txt_tmprazonsocial.setDocument(new UpperCaseNumberDocument(255));
        txt_tmprazonsocial.addFocusListener(this);
        pnl.add(txt_tmprazonsocial, gbc);
        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.NONE;

        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.gridx = 7;
        JLabel lbl_RucCliente = new JLabel("RUC/DNI");
        pnl.add(lbl_RucCliente, gbc);

        gbc.gridx = 8;
        txt_ruc = new JTextField();
        txt_ruc.setColumns(7);
        txt_ruc.addFocusListener(this);
        txt_ruc.setDocument(new IntegerDocument(11));
        txt_ruc.addKeyListener(this);
        pnl.add(txt_ruc, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblItem = new JLabel("Item");
        lblItem.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblItem, gbc);

        gbc.gridx = 1;
        gbc.insets = new Insets(2, 2, 2, 0);
        txt_iditem = new JTextField();
        txt_iditem.addKeyListener(this);
        txt_iditem.setColumns(7);
        txt_iditem.setDocument(new IntegerDocument(6));
        txt_iditem.addFocusListener(this);
        txt_iditem.setFont(new Font("Garamond", 0, 14));
        pnl.add(txt_iditem, gbc);

        gbc.gridx = 2;
        gbc.gridwidth = 5;
        gbc.insets = new Insets(2, 0, 2, 2);
        gbc.fill = GridBagConstraints.HORIZONTAL;
        txt_descripcionitem = new JTextField();
        txt_descripcionitem.addFocusListener(this);
        txt_descripcionitem.setFont(new Font("Garamond", 0, 14));
        txt_descripcionitem.setDocument(new UpperCaseNumberDocument(255));
        txt_descripcionitem.addKeyListener(this);
        pnl.add(txt_descripcionitem, gbc);
        gbc.fill = GridBagConstraints.NONE;
        gbc.gridwidth = 1;
        gbc.insets = new Insets(2, 2, 2, 2);

        gbc.gridx = 7;
        JLabel lbl_idalmacen = new JLabel("Almacen");
        pnl.add(lbl_idalmacen, gbc);

        gbc.gridx = 8;
        gbc.gridwidth = 3;
        cbo_idalmacen = new CComboBox();
        cbo_idalmacen.setFont(new Font(Font.SANS_SERIF, 0, 11));
        cbo_idalmacen.addActionListener(this);
        cbo_idalmacen.addKeyListener(this);
        pnl.add(cbo_idalmacen, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 3;
        JLabel lbl_familia = new JLabel("Familia");
        lbl_familia.setFont(new Font("Verdana", 0, 11));
        pnl.add(lbl_familia, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 4;
        cbo_idfamilia = new JComboBox();
        cbo_idfamilia.addActionListener(this);
        cbo_idfamilia.addKeyListener(this);
        pnl.add(cbo_idfamilia, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 5;
        JLabel lbl_subfamilia = new JLabel("SubFamilia");
        lbl_subfamilia.setFont(new Font("Verdana", 0, 11));
        pnl.add(lbl_subfamilia, gbc);

        gbc.gridx = 6;
        cbo_idsubfamilia = new JComboBox();
        cbo_idsubfamilia.addActionListener(this);
        cbo_idsubfamilia.setEnabled(false);
        cbo_idsubfamilia.addKeyListener(this);
        pnl.add(cbo_idsubfamilia, gbc);

        gbc.gridx = 7;
        JLabel lblMarca = new JLabel("Marca");
        lblMarca.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblMarca, gbc);

        gbc.gridx = 8;
        cbo_idmarca = new JComboBox();
        cbo_idmarca.addKeyListener(this);
        cbo_idmarca.addActionListener(this);
        pnl.add(cbo_idmarca, gbc);
        
        gbc.gridy=5;
        gbc.gridx = 1;
        gbc.gridwidth = 1;

        btnBuscarDocumento = new JButton("F5", gif.SEARCH16);
        btnBuscarDocumento.setMnemonic('B');
        btnBuscarDocumento.setFont(new Font(Font.SANS_SERIF, 0, 9));
        btnBuscarDocumento.setOpaque(false);
        btnBuscarDocumento.setIconTextGap(10);
        btnBuscarDocumento.setToolTipText("Buscar Documento");
        btnBuscarDocumento.setHorizontalAlignment(SwingConstants.LEFT);
        btnBuscarDocumento.setContentAreaFilled(true);
        btnBuscarDocumento.setBorderPainted(true);
        btnBuscarDocumento.setFocusable(true);
        btnBuscarDocumento.setFocusPainted(false);
        btnBuscarDocumento.addActionListener(this);
        pnl.add(btnBuscarDocumento, gbc);

        return pnlPrinc;
    }

    protected JPanel getPnlBuscarPor() {
        JPanel pnl = new JPanel(new FlowLayout(FlowLayout.LEADING, 5, 5));
        JLabel lbl_buscarpor = new JLabel("Buscar Por");
        pnl.add(lbl_buscarpor);

        chk_documento = new JCheckBox("Documento");
        chk_documento.addItemListener(this);
        chk_documento.setFont(new Font("Verdana", 1, 10));
        chk_documento.addKeyListener(this);
        chk_documento.setHorizontalTextPosition(SwingConstants.RIGHT);
        chk_documento.addFocusListener(this);
        chk_documento.setOpaque(false);
        pnl.add(chk_documento);

        chk_cliente = new JCheckBox("Cliente");
        chk_cliente.addItemListener(this);
        chk_cliente.setFont(new Font("Verdana", 1, 10));
        chk_cliente.addKeyListener(this);
        chk_cliente.setHorizontalTextPosition(SwingConstants.RIGHT);
        chk_cliente.addFocusListener(this);
        chk_cliente.setOpaque(false);
        pnl.add(chk_cliente);
        return pnl;
    }

    protected JPanel getPnlCenter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        modeltable = new DocumentoVentaDetalleTableModel();
        tblSearch = new CTable();
        tblSearch.setModel(modeltable);
        tblSearch.setAllTableNoEditable();
        tblSearch.setAllColumnNoResizable();
        tblSearch.setNoVisibleColumn(7);
        tblSearch.setNoVisibleColumn(8);
        tblSearch.setNoVisibleColumn(9);
        tblSearch.setNoVisibleColumn(11);
        tblSearch.setNoVisibleColumn(12);
        tblSearch.setNoVisibleColumn(13);
        tblSearch.setColumnEditable(0);
        tblSearch.setAllColumnPreferredWidth();
        tblSearch.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                obtenerDatos(0);
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);

        tblSearch.addKeyListener(this);
        tblSearch.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                    obtenerDatos(0);
                }
            }
        });

        scrollSearch = new JScrollPane(tblSearch);
        scrollSearch.setPreferredSize(new Dimension(855, 202));
        pnl.add(scrollSearch, BorderLayout.CENTER);

        check = new JCheckBox("Seleccionar Todo");
        check.addItemListener(this);
        check.setFont(new Font("Verdana", 1, 11));
        check.addKeyListener(this);
        check.setHorizontalTextPosition(SwingConstants.LEFT);
        check.addFocusListener(this);
        check.setOpaque(false);
        pnl.add(check, BorderLayout.NORTH);

        return pnl;
    }

    protected JPanel getPnlSouth() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        cbCancel = new JButton("Cancelar", gif.CANCEL16);
        cbCancel.setMnemonic('C');
        cbCancel.setHorizontalAlignment(SwingConstants.LEFT);
        cbCancel.setIconTextGap(10);
        cbCancel.addActionListener(this);
        cbCancel.setFont(new Font("Verdana", 1, 10));
        cbCancel.setOpaque(false);
        cbCancel.addKeyListener(this);
        cbCancel.setFocusPainted(false);
        pnlPrinc.add(cbCancel, BorderLayout.WEST);

        btnAgregar = new JButton("Agregar", gif.ADD16);
        btnAgregar.setMnemonic('B');
        btnAgregar.setHorizontalAlignment(SwingConstants.LEFT);
        btnAgregar.setIconTextGap(10);
        btnAgregar.addActionListener(this);
        btnAgregar.setFont(new Font("Verdana", 1, 10));
        btnAgregar.setOpaque(false);
        btnAgregar.addKeyListener(this);
        btnAgregar.setFocusPainted(false);
        pnlPrinc.add(btnAgregar, BorderLayout.EAST);
        return pnlPrinc;
    }

    public void cargarTabla(Component ls_comp) {
    }

    public void loadMarca() {
    }

    public void loadFamilia() {
    }

    public void loadSubFamilia(String xcodfamilia) {
    }

    public void loadAlmacen(String xcodPuntoVenta) {
    }

    @Override
    public void windowClosing(WindowEvent e) {
        dispose();
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_idregconta && txt_idregconta.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_idregconta.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txt_idregconta.setText(nuevaserie);
        }

        if (e.getSource() == txt_iditem && txt_iditem.getText().trim().length() > 0) {
            String serie = "000000" + txt_iditem.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 6, serie.length());

            txt_iditem.setText(nuevaserie);
        }

        if (e.getSource() == txt_preimpreso && txt_preimpreso.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_preimpreso.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txt_preimpreso.setText(nuevaserie);
        }
    }

    @Override
    public void windowOpened(WindowEvent e) {
        txt_preimpreso.requestFocus();
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_descripcionitem) {
            txt_descripcionitem.selectAll();
        }

        if (e.getSource() == txt_iditem) {
            txt_iditem.selectAll();
        }

        if (e.getSource() == txt_idregconta) {
            txt_idregconta.selectAll();
        }

        if (e.getSource() == ((JTextFieldDateEditor) dc_fechainicio.getDateEditor())) {
            ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).selectAll();
        }

        if (e.getSource() == ((JTextFieldDateEditor) dc_fechafin.getDateEditor())) {
            ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).selectAll();
        }

        if (e.getSource() == txt_tmprazonsocial) {
            txt_tmprazonsocial.selectAll();
        }

        if (e.getSource() == txt_ruc) {
            txt_ruc.selectAll();
        }

        if (e.getSource() == txt_serie) {
            txt_serie.selectAll();
        }

        if (e.getSource() == txt_preimpreso) {
            txt_preimpreso.selectAll();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }

        if (e.getKeyCode() == KeyEvent.VK_F5) {
            this.buscarDocumento();
        }

        if (e.getKeyChar() == '\n') {
            if (txt_idregconta == e.getSource()) {
                cbo_idtipodoc.requestFocus();
            }

            if (cbo_idtipodoc == e.getSource()) {
                txt_serie.requestFocus();
            }

            if (txt_serie == e.getSource()) {
                txt_preimpreso.requestFocus();
            }

            if (txt_preimpreso == e.getSource()) {
                ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).requestFocus();
            }

            if (cbo_idestado == e.getSource()) {
                txt_idanexo.requestFocus();
            }

            if (txt_idanexo == e.getSource()) {
                txt_tmprazonsocial.requestFocus();
            }

            if (txt_tmprazonsocial == e.getSource()) {
                if (txt_tmprazonsocial.getText().trim().length() == 0) {
                    txt_ruc.requestFocus();
                } else {
                    BuscarCliente buscar_cliente = new BuscarCliente(this, path);
                    Anexo a = new Anexo();
                    a.setIdTipoAnexo("2");
                    a.setIdEmpresa(usuario.getCodempresa());
                    a.setDescripcion(txt_tmprazonsocial.getText().trim());
                    buscar_cliente.cargarTabla(a, null, 0);
                }
            }

            if (txt_ruc == e.getSource()) {
                txt_iditem.requestFocus();
            }

            if (txt_iditem == e.getSource()) {
                txt_descripcionitem.requestFocus();
            }

            if (txt_descripcionitem == e.getSource()) {
                cbo_idalmacen.requestFocus();
            }

            if (cbo_idalmacen == e.getSource()) {
                cbo_idfamilia.requestFocus();
            }

            if (cbo_idfamilia == e.getSource()) {
                if (cbo_idsubfamilia.isEnabled()) {
                    cbo_idsubfamilia.requestFocus();
                } else {
                    cbo_idmarca.requestFocus();
                }
            }

            if (cbo_idsubfamilia == e.getSource()) {
                cbo_idmarca.requestFocus();
            }

            if (cbo_idmarca == e.getSource()) {
                btnBuscarDocumento.requestFocus();
            }

            if (btnBuscarDocumento == e.getSource()) {
                check.requestFocus();
            }

            if (check == e.getSource()) {
                if (tblSearch.getRowCount() > 0) {
                    tblSearch.setRowSelectionInterval(0, 0);
                    tblSearch.requestFocus();
                } else {
                    cbCancel.requestFocus();
                }
            }
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        boolean isSelected;

        isSelected = (e.getStateChange() == ItemEvent.SELECTED);

        if (e.getItemSelectable() == check) {
            for (int i = 0; i < modeltable.getRowCount(); i++) {
                modeltable.getDocumentoVentaDet(i).setSeleccionado(isSelected);
                modeltable.getDocumentoVentaDet(i).setCantidad_despachar(modeltable.getDocumentoVentaDet(i).isSeleccionado() ? String.valueOf(modeltable.getDocumentoVentaDet(i).getTransito()) : "");
            }

            modeltable.fireTableDataChanged();
        }

        if (e.getItemSelectable() == chk_documento) {
            if (isSelected) {
                chk_cliente.setSelected(false);
                habilitarControles(true);
                cbo_idtipodoc.requestFocus();
            } else {
                chk_cliente.setSelected(true);
                habilitarControles(false);
                txt_idanexo.requestFocus();
            }
        }

        if (e.getItemSelectable() == chk_cliente) {
            if (isSelected) {
                chk_documento.setSelected(false);
            } else {
                chk_documento.setSelected(true);
            }
        }

    }

    public void habilitarControles(boolean e) {
        txt_idregconta.setText("");
        cbo_idtipodoc.setSelectedIndex(0);
        txt_serie.setText("");
        txt_preimpreso.setText("");

        txt_idregconta.setEditable(e);
        cbo_idtipodoc.setEnabled(e);
        txt_serie.setEditable(e);
        txt_preimpreso.setEditable(e);

        txt_ruc.setText("");
        txt_tmprazonsocial.setText("");
        txt_idanexo.setText("");

        txt_ruc.setEditable(!e);
        txt_tmprazonsocial.setEditable(!e);
        txt_idanexo.setEditable(!e);
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    protected void buscarDocumento() {
    }

    protected boolean validateBusqueda() {
        if (cbo_idtipodoc.getSelectedIndex() > 0 && txt_serie.getText().trim().length() >= 3
                && txt_preimpreso.getText().trim().length() == 10) {
            return true;
        }
        return txt_idanexo.getText().trim().length() == 10;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource().equals(btnBuscarDocumento)) {
            this.buscarDocumento();
        }
        if (e.getSource() == dc_fechainicio.getCalendarButton()) {
            dc_fechainicio.setSelectableDateRange(DateTime.format(100, 0, 1), dc_fechafin.getDate());
        }

        if (e.getSource() == dc_fechafin.getCalendarButton()) {
            dc_fechafin.setSelectableDateRange(dc_fechainicio.getDate(), dc_fechafin.getMaxSelectableDate());
        }

        if (cbCancel == e.getSource()) {
            dispose();
        }

        if (e.getSource() == btnAgregar) {
            obtenerDatos(0);
        }

        if (cbo_idfamilia == e.getSource()) {
            if (cbo_idfamilia.getItemCount() > 0) {
                if (cbo_idfamilia.getSelectedIndex() >= 0) {
                    if (cbo_idfamilia.getSelectedIndex() == 0) {
                        cbo_idsubfamilia.removeAllItems();
                        cbo_idsubfamilia.setEnabled(false);
                    } else {
                        cbo_idsubfamilia.setEnabled(true);
                        loadSubFamilia(xfamilia.get(cbo_idfamilia.getSelectedIndex() - 1).getIdFamilia());
                    }
                }
            }
        }
    }

    public boolean cargarCliente(String id_cliente) {
        return false;
    }

    public void obtenerDatos(int op) {
    }

    protected String getIdTipoDoc() {
        if (cbo_idtipodoc.getSelectedIndex() > 0) {
            return xTipoDocVenta.get(cbo_idtipodoc.getSelectedIndex() - 1).getIdTipoDoc();
        }
        return "";
    }

    public void cargarTabla() {
    }

    @Override
    public void keyTyped(KeyEvent e) {
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
    public void keyReleased(KeyEvent e) {
    }

}
