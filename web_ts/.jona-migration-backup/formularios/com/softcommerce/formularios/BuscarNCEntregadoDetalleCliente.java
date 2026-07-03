package com.softcommerce.formularios;

import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.BeanFamilia;
import com.softcommerce.beans.BeanMarca;
import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.BeanSubFamilia;
import com.softcommerce.beans.Usuario;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import com.softcommerce.general.controles.CDialog;
import com.softcommerce.general.controles.JHInternal;
import com.softcommerce.general.controles.CComboBox;
import java.beans.PropertyChangeEvent;
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
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.event.FocusListener;
import java.awt.event.ItemListener;
import java.awt.event.MouseListener;
import java.beans.PropertyChangeListener;
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
import com.softcommerce.general.tablas.IngresoDevolucionClienteTableModel;
import com.softcommerce.util.FormatObject;

public class BuscarNCEntregadoDetalleCliente extends CDialog implements ActionListener, KeyListener, WindowListener, ItemListener, FocusListener, MouseListener, PropertyChangeListener {

    private static final long serialVersionUID = 1L;
    private Component comp;
    private IngresoDevolucionClienteTableModel modeltable;
    private CTable tblSearch;
    private JScrollPane scrollSearch;
    private JButton btn_Agregar;
    private JButton cbCancel;
    private JButton btn_buscardocumento;
    private JComboBox cbo_idtipodoc;
    private JComboBox cbo_idestado;
    private JTextField txt_idanexo;
    private JTextField txt_serie;
    private JTextField txt_preimpreso;
    private JTextField txt_ruc;
    private JTextField txt_tmprazonsocial;
    private JTextField txt_idregconta;
    private JDateChooser dc_fechainicio;
    private JDateChooser dc_fechafin;
    private JHInternal arg;
    private JTextField txt_iditem;
    private JTextField txt_descripcionitem;
    private List<BeanMarca> xmarca;
    private JComboBox cbo_idmarca;
    private List<BeanSubFamilia> xSubFamiliaFiltro;
    private JComboBox cbo_idsubfamilia;
    private List<BeanFamilia> xfamilia;
    private JComboBox cbo_idfamilia;
    private Usuario usuario;
    private CComboBox cbo_idalmacen;
    private List<Almacen> xalmacen;
    private JCheckBox check;
    private JCheckBox chk_documento;
    private JCheckBox chk_cliente;

    public BuscarNCEntregadoDetalleCliente(Frame arg0, JHInternal pnlguia, Usuario usuario, java.net.URL path) {
        super(arg0);
        this.path = path;
        this.arg = pnlguia;
        this.usuario = usuario;
        initialize();
    }

    private void initialize() {
        addWindowListener(this);

        Gif gif = new Gif();

        JPanel pnl = new JPanel();
        pnl.setBackground(new Color(243, 248, 252));
        pnl.setBorder(new EmptyBorder(5, 5, 5, 5));
        pnl.setFocusable(false);
        pnl.setOpaque(false);
        pnl.setLayout(null);

        JLabel lbl_buscarpor = new JLabel("Buscar Por");
        lbl_buscarpor.setBounds(5, 5, 60, 20);
        pnl.add(lbl_buscarpor);

        chk_documento = new JCheckBox("Documento");
        chk_documento.setBounds(65, 5, 100, 20);
        chk_documento.addItemListener(this);
        chk_documento.setFont(new Font("Verdana", 1, 10));
        chk_documento.addKeyListener(this);
        chk_documento.setHorizontalTextPosition(SwingConstants.RIGHT);
        chk_documento.addFocusListener(this);
        chk_documento.setOpaque(false);
        pnl.add(chk_documento);

        chk_cliente = new JCheckBox("Cliente");
        chk_cliente.setBounds(165, 5, 100, 20);
        chk_cliente.addItemListener(this);
        chk_cliente.setFont(new Font("Verdana", 1, 10));
        chk_cliente.addKeyListener(this);
        chk_cliente.setHorizontalTextPosition(SwingConstants.RIGHT);
        chk_cliente.addFocusListener(this);
        chk_cliente.setOpaque(false);
        pnl.add(chk_cliente);

        JLabel lblSerie = new JLabel("Documento");
        lblSerie.setBounds(5, 30, 60, 20);
        pnl.add(lblSerie);

        txt_idregconta = new JTextField();
        txt_idregconta.setBounds(70, 30, 90, 20);
        txt_idregconta.addKeyListener(this);
        txt_idregconta.setDocument(new IntegerDocument(10));
        txt_idregconta.addFocusListener(this);
        txt_idregconta.setFont(new Font("Garamond", 0, 14));
        pnl.add(txt_idregconta);

        cbo_idtipodoc = new JComboBox();
        cbo_idtipodoc.setBounds(165, 30, 35, 20);
        cbo_idtipodoc.addItem("T");
        cbo_idtipodoc.addItem("F");
        cbo_idtipodoc.addItem("B");
        cbo_idtipodoc.addItem("TI");
        cbo_idtipodoc.addActionListener(this);
        cbo_idtipodoc.addKeyListener(this);
        pnl.add(cbo_idtipodoc);

        txt_serie = new JTextField();
        txt_serie.setBounds(205, 30, 30, 20);
        txt_serie.addKeyListener(this);
        txt_serie.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_serie.addFocusListener(this);
        FormatObject.formatJTextFieldSerie(txt_serie);
        txt_serie.setForeground(Color.BLACK);
        pnl.add(txt_serie);

        txt_preimpreso = new JTextField();
        txt_preimpreso.setBounds(240, 30, 80, 20);
        txt_preimpreso.addKeyListener(this);
        txt_preimpreso.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_preimpreso.addFocusListener(this);
        txt_preimpreso.setDocument(new IntegerDocument(10));
        txt_preimpreso.setForeground(Color.BLACK);
        pnl.add(txt_preimpreso);

        JLabel lblFechaInicio = new JLabel("Fec Inicio");
        lblFechaInicio.setDisplayedMnemonic('c');
        lblFechaInicio.setBounds(360, 30, 55, 20);
        pnl.add(lblFechaInicio);

        dc_fechainicio = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).addFocusListener(this);
        dc_fechainicio.setBounds(415, 30, 90, 20);
        dc_fechainicio.getJCalendar().addMouseListener(this);
        dc_fechainicio.getJCalendar().addFocusListener(this);
        dc_fechainicio.getJCalendar().addKeyListener(this);
        dc_fechainicio.getCalendarButton().addMouseListener(this);
        dc_fechainicio.getCalendarButton().addActionListener(this);
        dc_fechainicio.addPropertyChangeListener(this);
        dc_fechainicio.addMouseListener(this);
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
        pnl.add(dc_fechainicio);

        JLabel lblFechaFin = new JLabel("Fec Fin");
        lblFechaFin.setBounds(520, 30, 45, 20);
        lblFechaFin.setDisplayedMnemonic('a');
        pnl.add(lblFechaFin);

        dc_fechafin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).addFocusListener(this);
        dc_fechafin.setBounds(565, 30, 90, 20);
        dc_fechafin.getJCalendar().addMouseListener(this);
        dc_fechafin.getJCalendar().addFocusListener(this);
        dc_fechafin.getJCalendar().addKeyListener(this);
        dc_fechafin.getCalendarButton().addMouseListener(this);
        dc_fechafin.getCalendarButton().addActionListener(this);
        dc_fechafin.addPropertyChangeListener(this);
        dc_fechafin.addMouseListener(this);
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
        pnl.add(dc_fechafin);

        JLabel lbl_estado = new JLabel("Est");
        lbl_estado.setFont(new Font("Verdana", 0, 11));
        lbl_estado.setBounds(685, 30, 20, 20);
        pnl.add(lbl_estado);

        cbo_idestado = new JComboBox();
        cbo_idestado.setBounds(705, 30, 45, 20);
        cbo_idestado.addItem("T");
        cbo_idestado.addItem("PEN");
        cbo_idestado.addItem("PAA");
        cbo_idestado.addActionListener(this);
        cbo_idestado.addKeyListener(this);
        pnl.add(cbo_idestado);

        JLabel lblRazonSocial = new JLabel("R. Social");
        lblRazonSocial.setBounds(5, 60, 50, 20);
        pnl.add(lblRazonSocial);

        txt_idanexo = new JTextField();
        txt_idanexo.setBounds(55, 60, 72, 20);
        txt_idanexo.addFocusListener(this);
        txt_idanexo.addKeyListener(this);
        pnl.add(txt_idanexo);

        txt_tmprazonsocial = new JTextField();
        txt_tmprazonsocial.setBounds(130, 60, 310, 20);
        txt_tmprazonsocial.addKeyListener(this);
        txt_tmprazonsocial.setDocument(new UpperCaseNumberDocument(255));
        txt_tmprazonsocial.addFocusListener(this);
        pnl.add(txt_tmprazonsocial);

        JLabel lbl_RucCliente = new JLabel("RUC/DNI");
        lbl_RucCliente.setBounds(460, 60, 50, 20);
        pnl.add(lbl_RucCliente);

        txt_ruc = new JTextField();
        txt_ruc.setBounds(510, 60, 80, 20);
        txt_ruc.addFocusListener(this);
        txt_ruc.setDocument(new IntegerDocument(11));
        txt_ruc.addKeyListener(this);
        pnl.add(txt_ruc);

        JLabel lblItem = new JLabel("Item");
        lblItem.setFont(new Font("Verdana", 0, 11));
        lblItem.setBounds(5, 90, 35, 20);
        pnl.add(lblItem);

        txt_iditem = new JTextField();
        txt_iditem.setBounds(45, 90, 90, 20);
        txt_iditem.addKeyListener(this);
        txt_iditem.setDocument(new IntegerDocument(6));
        txt_iditem.addFocusListener(this);
        txt_iditem.setFont(new Font("Garamond", 0, 14));
        pnl.add(txt_iditem);

        txt_descripcionitem = new JTextField();
        txt_descripcionitem.setBounds(140, 90, 360, 20);
        txt_descripcionitem.addFocusListener(this);
        txt_descripcionitem.setFont(new Font("Garamond", 0, 14));
        txt_descripcionitem.setDocument(new UpperCaseNumberDocument(255));
        txt_descripcionitem.addKeyListener(this);
        pnl.add(txt_descripcionitem);

        JLabel lbl_idalmacen = new JLabel("Almacen");
        lbl_idalmacen.setBounds(530, 90, 40, 20);
        pnl.add(lbl_idalmacen);

        cbo_idalmacen = new CComboBox();
        cbo_idalmacen.setFont(new Font(Font.SANS_SERIF, 0, 11));
        cbo_idalmacen.setBounds(580, 90, 210, 20);
        cbo_idalmacen.addActionListener(this);
        cbo_idalmacen.addKeyListener(this);
        pnl.add(cbo_idalmacen);

        JLabel lbl_familia = new JLabel("Familia");
        lbl_familia.setFont(new Font("Verdana", 0, 11));
        lbl_familia.setBounds(5, 120, 50, 20);
        pnl.add(lbl_familia);

        cbo_idfamilia = new JComboBox();
        cbo_idfamilia.setBounds(50, 120, 180, 20);
        cbo_idfamilia.addActionListener(this);
        cbo_idfamilia.addKeyListener(this);
        pnl.add(cbo_idfamilia);

        JLabel lbl_subfamilia = new JLabel("SubFamilia");
        lbl_subfamilia.setFont(new Font("Verdana", 0, 11));
        lbl_subfamilia.setBounds(275, 120, 70, 20);
        pnl.add(lbl_subfamilia);

        cbo_idsubfamilia = new JComboBox();
        cbo_idsubfamilia.setBounds(340, 120, 165, 20);
        cbo_idsubfamilia.addActionListener(this);
        cbo_idsubfamilia.setEnabled(false);
        cbo_idsubfamilia.addKeyListener(this);
        pnl.add(cbo_idsubfamilia);

        JLabel lblMarca = new JLabel("Marca");
        lblMarca.setFont(new Font("Verdana", 0, 11));
        lblMarca.setBounds(530, 120, 110, 20);
        pnl.add(lblMarca);

        cbo_idmarca = new JComboBox();
        cbo_idmarca.addKeyListener(this);
        cbo_idmarca.addActionListener(this);
        cbo_idmarca.setBounds(570, 120, 160, 20);
        pnl.add(cbo_idmarca);

        btn_buscardocumento = new JButton("F5", gif.SEARCH16);
        btn_buscardocumento.setBounds(760, 120, 70, 20);
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
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        pnl.add(this.btn_buscardocumento);

        check = new JCheckBox("Seleccionar Todo");
        check.setBounds(5, 145, 150, 20);
        check.addItemListener(this);
        check.setFont(new Font("Verdana", 1, 11));
        check.addKeyListener(this);
        check.setHorizontalTextPosition(SwingConstants.LEFT);
        check.addFocusListener(this);
        check.setOpaque(false);
        pnl.add(check);

        modeltable = new IngresoDevolucionClienteTableModel();
        tblSearch = new CTable();
        tblSearch.setModel(modeltable);
        tblSearch.setAllTableNoEditable();
        tblSearch.setAllColumnNoResizable();
        tblSearch.setColumnEditable(0);
        //tblSearch.setColumnEditable(8);
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

        scrollSearch = new JScrollPane(tblSearch, JScrollPane.VERTICAL_SCROLLBAR_ALWAYS, JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS);
        scrollSearch.setBounds(10, 165, 855, 202);
        pnl.add(scrollSearch);

        cbCancel = new JButton("Cancelar", gif.CANCEL16);
        cbCancel.setMnemonic('C');
        cbCancel.setHorizontalAlignment(SwingConstants.LEFT);
        cbCancel.setIconTextGap(10);
        cbCancel.addActionListener(this);
        cbCancel.setFont(new Font("Verdana", 1, 10));
        cbCancel.setOpaque(false);
        cbCancel.addKeyListener(this);
        cbCancel.setFocusPainted(false);
        cbCancel.setBounds(5, 375, 120, 25);
        pnl.add(cbCancel);

        btn_Agregar = new JButton("Agregar", gif.ADD16);
        btn_Agregar.setMnemonic('B');
        btn_Agregar.setHorizontalAlignment(SwingConstants.LEFT);
        btn_Agregar.setIconTextGap(10);
        btn_Agregar.addActionListener(this);
        btn_Agregar.setFont(new Font("Verdana", 1, 10));
        btn_Agregar.setOpaque(false);
        btn_Agregar.addKeyListener(this);
        btn_Agregar.setFocusPainted(false);
        btn_Agregar.setBounds(745, 375, 120, 25);
        pnl.add(btn_Agregar);

        loadMarca();
        loadFamilia();
        loadAlmacen(usuario.getCodpuntoventa());

        setBackground(new Color(245, 245, 245));
        setTitle("Buscar Documento de Venta - BuscarNCEntregadoDetalleCliente");
        setContentPane(pnl);
        setModal(true);
        setResizable(false);
        setSize(880, 440);
        ComponentToolKit.centerComponentPosicion(this);
    }

    public void cargarTabla(Component ls_comp) {
        this.comp = ls_comp;
        ComponentToolKit.centerComponentPosicion(this);
        chk_documento.setSelected(true);
        setVisible(true);
    }

    public void loadMarca() {
        try {
            RnMarca regla_Marca = new RnMarca(path);

            if (xmarca != null) {
                xmarca.clear();
            } else {
                xmarca = new ArrayList<BeanMarca>();
            }

            xmarca.addAll(regla_Marca.listarGeneral(usuario.getCodempresa()));

            cbo_idmarca.removeAllItems();
            cbo_idmarca.addItem("--- TODOS ---");

            for (Integer i = 0; i < xmarca.size(); i++) {
                cbo_idmarca.addItem(xmarca.get(i).getDescripcion());
            }

            cbo_idmarca.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadFamilia() {
        try {
            RnFamilia regla_Familia = new RnFamilia(path);

            if (xfamilia != null) {
                xfamilia.clear();
            } else {
                xfamilia = new ArrayList();
            }

            xfamilia.addAll(regla_Familia.listar("", "", usuario.getCodempresa()));

            cbo_idfamilia.removeAllItems();
            cbo_idfamilia.addItem("--- TODOS ---");

            for (int i = 0; i < xfamilia.size(); i++) {
                cbo_idfamilia.addItem(xfamilia.get(i).getDescripcion());
            }

            cbo_idfamilia.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadSubFamilia(String xcodfamilia) {
        try {
            BeanSubFamilia s = new BeanSubFamilia();
            BeanFamilia beanFamilia = new BeanFamilia();
            beanFamilia.setIdFamilia(xcodfamilia);
            s.setBeanFamilia(beanFamilia);
            //s.setId_empresa(usuario.getCodempresa());

            RnSubFamilia regla_SubFamilia = new RnSubFamilia(path);

            if (xSubFamiliaFiltro != null) {
                xSubFamiliaFiltro.clear();
            } else {
                xSubFamiliaFiltro = new ArrayList<BeanSubFamilia>();
            }

            xSubFamiliaFiltro.addAll(regla_SubFamilia.listar(s));

            cbo_idsubfamilia.removeAllItems();
            cbo_idsubfamilia.addItem("--- TODOS ---");

            for (Integer i = 0; i < xSubFamiliaFiltro.size(); i++) {
                cbo_idsubfamilia.addItem(xSubFamiliaFiltro.get(i).getDescripcion());
            }

            cbo_idsubfamilia.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadAlmacen(String xcodPuntoVenta) {
        try {
            RnAlmacen regla_Almacen = new RnAlmacen(path);

            if (xalmacen != null) {
                xalmacen.clear();
            } else {
                xalmacen = new ArrayList<Almacen>();
            }

            xalmacen.addAll(regla_Almacen.listar("", "", xcodPuntoVenta));

            cbo_idalmacen.removeAllItems();

            for (int i = 0; i < xalmacen.size(); i++) {
                cbo_idalmacen.addItem(xalmacen.get(i).getDescripcion());
            }

            cbo_idalmacen.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
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
        if (e.getSource().equals(txt_serie)) {
            //FormatObject.formatSerie((JTextField) e.getSource());
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
            if ((!cbo_idtipodoc.getSelectedItem().toString().trim().equals("T") && (txt_preimpreso.getText().trim().length() == 10))
                    || (txt_idanexo.getText().trim().length() == 10)) {
                check.setSelected(false);
                cargarTabla();
                check.setSelected(true);
            } else {
                JOptionPane.showMessageDialog(this, "Para buscar todos los items pendientes de salida, debes especificar \nel tipo de documento y su numero ó"
                        + " indicar el cliente.", "Datos incompletos de Busqueda.", JOptionPane.INFORMATION_MESSAGE);
            }
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
                btn_buscardocumento.requestFocus();
            }

            if (btn_buscardocumento == e.getSource()) {
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
        cbo_idtipodoc.setSelectedItem("T");
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
        cargarCliente(valor.toString());
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == btn_buscardocumento) {
            if ((!cbo_idtipodoc.getSelectedItem().toString().trim().equals("T") && (txt_preimpreso.getText().trim().length() == 10))
                    || (txt_idanexo.getText().trim().length() == 10)) {
                check.setSelected(false);
                cargarTabla();
                check.setSelected(true);
            } else {
                JOptionPane.showMessageDialog(this, "Para buscar todos los items pendientes de salida, debes especificar \nel tipo de documento y su numero ó"
                        + " indicar el cliente.", "Datos incompletos de Busqueda.", JOptionPane.INFORMATION_MESSAGE);
            }

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

        if (e.getSource() == btn_Agregar) {
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
        try {
            RnAnexo regla = new RnAnexo(path);
            Anexo a = new Anexo();
            a.setIdAnexo(id_cliente);
            a.setTasadescuento(-1);
            a.setNumeroInicial(-1);
            a.setNumeroFinal(-1);

            List<Anexo> reg = regla.listarAnexo(a);

            if (reg != null && reg.size() > 0) {
                Anexo cliente = reg.get(0);

                txt_idanexo.setText(cliente.getIdAnexo());
                txt_ruc.setText(cliente.getNumerodoc());
                txt_tmprazonsocial.setText(cliente.getDescripcion());

                return true;
            }

            return false;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    public void obtenerDatos(int op) {
        if (tblSearch.getRowCount() > 0) {
            List<ContaItem> v = new ArrayList<ContaItem>();

            for (int i = 0; i < tblSearch.getRowCount(); i++) {
                if (modeltable.getDocumentoVentaDet(i).isSeleccionado()) {
                    v.add(modeltable.getDocumentoVentaDet(i));
                }
            }

            if (arg != null) {
                arg.setValueSearch(v, comp);
            }

            dispose();
        }
    }

    public void cargarTabla() {
        try {
            ContaCab r = new ContaCab();
            r.setSerie(txt_serie.getText().trim());
            r.setPreimpreso(txt_preimpreso.getText().trim());
            r.setFEmision(DateTime.format(1901, 0, 1));
            r.setFInicial((!((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText().equals("__/__/____") && !((JTextFieldDateEditor) dc_fechafin.getDateEditor()).getText().equals("__/__/____") && DateTime.isValidDate(((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText()) && DateTime.isValidDate(((JTextFieldDateEditor) dc_fechafin.getDateEditor()).getText())) ? dc_fechainicio.getDate() : DateTime.format(1901, 0, 1));
            r.setFFinal((!((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText().equals("__/__/____") && !((JTextFieldDateEditor) dc_fechafin.getDateEditor()).getText().equals("__/__/____") && DateTime.isValidDate(((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText()) && DateTime.isValidDate(((JTextFieldDateEditor) dc_fechafin.getDateEditor()).getText())) ? dc_fechafin.getDate() : DateTime.format(1901, 0, 1));
            r.setDescripcionItem(txt_descripcionitem.getText().trim());
            r.setIdPuntoventa(usuario.getCodpuntoventa());
            r.setRcIdregconta(txt_idregconta.getText().trim());
            r.setIdTipoDoc(cbo_idtipodoc.getSelectedItem().toString().equals("F") ? "01" : cbo_idtipodoc.getSelectedItem().toString().equals("B") ? "03" : cbo_idtipodoc.getSelectedItem().toString().equals("TI") ? "TI" : "");
            r.setIdItem(txt_iditem.getText().trim());
            r.setIdFamilia(cbo_idfamilia.getSelectedIndex() > 0 ? xfamilia.get(cbo_idfamilia.getSelectedIndex() - 1).getIdFamilia() : "");
            r.setIdSubfamilia(cbo_idsubfamilia.getSelectedIndex() > 0 ? xSubFamiliaFiltro.get(cbo_idsubfamilia.getSelectedIndex() - 1).getIdSubFamilia() : "");
            r.setIdMarca(cbo_idmarca.getSelectedIndex() > 0 ? xmarca.get(cbo_idmarca.getSelectedIndex() - 1).getIdMarca() : "");
            r.setIdAlmacen(xalmacen.get(cbo_idalmacen.getSelectedIndex()).getIdAlmacen());
            r.setAnIdanexo(txt_idanexo.getText().trim());
            r.setIdEstado((cbo_idestado.getSelectedItem().toString().equals("PEN") ? "003" : (cbo_idestado.getSelectedItem().toString().equals("PAA") ? "004" : "")));
            r.setIdAuxiliar("00070");
            r.setTieneCantPordevolverCliente("SI");
            r.setCantPordespacharCliente(0);

            RnRegContaCab regla = new RnRegContaCab(path);
            List<ContaItem> v = new ArrayList<ContaItem>(10);
            v.addAll(regla.listarDetallesIngreso(r));
            modeltable.clearTable();
            modeltable.agregarVectorRegContaItem(v);
            tblSearch.setAllColumnPreferredWidth();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void propertyChange(PropertyChangeEvent evt) {
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

    public void filtrar() {
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }
}
