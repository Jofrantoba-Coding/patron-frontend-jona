package com.softcommerce.views.uibuscarordencomprasalidaajuste;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Almacen;
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
import com.softcommerce.general.controles.CLabel;
import java.beans.PropertyChangeEvent;
import com.softcommerce.iconos.Gif;
import java.awt.Color;
import java.awt.Component;
import java.awt.Font;
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
import java.util.List;
import javax.swing.JCheckBox;
import javax.swing.JComponent;
import javax.swing.KeyStroke;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnFamilia;
import com.softcommerce.reglasnegocio.RnMarca;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.reglasnegocio.RnSubFamilia;
import com.softcommerce.general.tablas.SalidaAjusteTableModel;
import com.softcommerce.util.FormatObject;
import java.awt.BorderLayout;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.util.Calendar;
import javax.swing.JOptionPane;

public class UiBuscarOrdenCompraSalidaAjuste
        extends CDialog
        implements InterUiBuscarOrdenCompraSalidaAjuste, ActionListener, KeyListener, WindowListener, ItemListener, FocusListener, MouseListener, PropertyChangeListener {

    private static final long serialVersionUID = 1L;
    protected Component comp;
    protected SalidaAjusteTableModel modeltable;
    protected CTable tblSearch;
    protected JScrollPane scrollSearch;
    protected JButton btn_Agregar;
    protected JButton cbCancel;
    protected JButton btn_buscardocumento;
    protected JComboBox cbo_idtipodoc;
    protected JComboBox cbo_idestado;
    protected JTextField txt_serie;
    protected JTextField txt_preimpreso;
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
    protected Main frm;

    public UiBuscarOrdenCompraSalidaAjuste(Main arg0, JHInternal pnlguia, Usuario usuario, java.net.URL path) {
        super(arg0);
        frm = arg0;
        this.path = path;
        this.arg = pnlguia;
        this.usuario = usuario;
        initialize();
    }

    protected void initialize() {
        addWindowListener(this);

        setBackground(new Color(245, 245, 245));
        setTitle("Buscar Orden de Compra Salida por Ajuste");
        setContentPane(this.getPnlPrincipal());
        this.loadCombo();
        this.pack();
        setModal(true);
        setResizable(false);
        setSize(880, 440);
        ComponentToolKit.centerComponentPosicion(this);
    }

    protected JPanel getPnlPrincipal() {
        Gif gif = new Gif();
        JPanel pnl = new JPanel();
        pnl.setBackground(new Color(243, 248, 252));
        pnl.setBorder(new EmptyBorder(5, 5, 5, 5));
        pnl.setFocusable(false);
        pnl.setOpaque(false);
        pnl.setLayout(new BorderLayout());

        pnl.add(this.getPnlNorth(gif), BorderLayout.NORTH);
        pnl.add(this.getPnlCenter(), BorderLayout.CENTER);
        pnl.add(this.getPnlSouth(gif), BorderLayout.SOUTH);
        return pnl;
    }

    protected JPanel getPnlNorth(Gif gif) {
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
        CLabel lblSerie = new CLabel("Documento");
        pnl.add(lblSerie, gbc);

        gbc.gridx = 1;
        txt_idregconta = new JTextField();
        txt_idregconta.addKeyListener(this);
        txt_idregconta.setDocument(new IntegerDocument(10));
        txt_idregconta.addFocusListener(this);
        txt_idregconta.setFont(new Font("Garamond", 0, 14));
        txt_idregconta.setColumns(8);
        pnl.add(txt_idregconta, gbc);

        gbc.gridx = 2;
        cbo_idtipodoc = new JComboBox();
        cbo_idtipodoc.addItem("OC");
        cbo_idtipodoc.addActionListener(this);
        cbo_idtipodoc.addKeyListener(this);
        pnl.add(cbo_idtipodoc, gbc);

        gbc.gridx = 3;
        txt_serie = new JTextField();
        txt_serie.addKeyListener(this);
        txt_serie.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_serie.addFocusListener(this);
        FormatObject.formatJTextFieldSerie(txt_serie);
        txt_serie.setForeground(Color.BLACK);
        txt_serie.setColumns(3);
        pnl.add(txt_serie, gbc);

        gbc.gridx = 4;
        txt_preimpreso = new JTextField();
        txt_preimpreso.addKeyListener(this);
        txt_preimpreso.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_preimpreso.addFocusListener(this);
        txt_preimpreso.setDocument(new IntegerDocument(10));
        txt_preimpreso.setForeground(Color.BLACK);
        txt_preimpreso.setColumns(8);
        pnl.add(txt_preimpreso, gbc);

        gbc.gridx = 5;
        CLabel lblFechaInicio = new CLabel("Fec Inicio");
        lblFechaInicio.setBounds(360, 10, 55, 20);
        pnl.add(lblFechaInicio);

        gbc.gridx = 6;
        dc_fechainicio = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).addFocusListener(this);
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
        dc_fechainicio.setDate(frm.getFechaInicio());
        pnl.add(dc_fechainicio, gbc);

        gbc.gridx = 7;
        CLabel lblFechaFin = new CLabel("Fec Fin");
        pnl.add(lblFechaFin, gbc);

        gbc.gridx = 8;
        dc_fechafin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).addFocusListener(this);
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
        dc_fechafin.setDate(frm.getFechaFin());
        pnl.add(dc_fechafin, gbc);

        gbc.gridx = 9;
        CLabel lbl_estado = new CLabel("Est");
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
        CLabel lblItem = new CLabel("Item");
        pnl.add(lblItem, gbc);

        gbc.gridx = 1;
        txt_iditem = new JTextField();
        txt_iditem.addKeyListener(this);
        txt_iditem.setDocument(new IntegerDocument(6));
        txt_iditem.addFocusListener(this);
        txt_iditem.setFont(new Font("Garamond", 0, 14));
        txt_iditem.setColumns(8);
        pnl.add(txt_iditem, gbc);

        gbc.gridx = 2;
        gbc.gridwidth = 5;
        txt_descripcionitem = new JTextField();
        txt_descripcionitem.addFocusListener(this);
        txt_descripcionitem.setFont(new Font("Garamond", 0, 14));
        txt_descripcionitem.setDocument(new UpperCaseNumberDocument(255));
        txt_descripcionitem.addKeyListener(this);
        txt_descripcionitem.setColumns(25);
        pnl.add(txt_descripcionitem, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 7;
        CLabel lbl_idalmacen = new CLabel("Almacen");
        pnl.add(lbl_idalmacen, gbc);

        gbc.gridx = 8;
        cbo_idalmacen = new CComboBox();
        cbo_idalmacen.setFont(new Font(Font.SANS_SERIF, 0, 11));
        cbo_idalmacen.addActionListener(this);
        cbo_idalmacen.addKeyListener(this);
        pnl.add(cbo_idalmacen, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        CLabel lbl_familia = new CLabel("Familia");
        pnl.add(lbl_familia, gbc);

        gbc.gridx = 1;
        gbc.gridwidth=3;
        cbo_idfamilia = new JComboBox();
        cbo_idfamilia.setBounds(50, 70, 180, 20);
        cbo_idfamilia.addActionListener(this);
        cbo_idfamilia.addKeyListener(this);
        pnl.add(cbo_idfamilia, gbc);
        gbc.gridwidth=1;

        gbc.gridx = 4;
        CLabel lbl_subfamilia = new CLabel("SubFamilia");
        pnl.add(lbl_subfamilia, gbc);

        gbc.gridx = 5;
        gbc.gridwidth=2;
        cbo_idsubfamilia = new JComboBox();
        cbo_idsubfamilia.addActionListener(this);
        cbo_idsubfamilia.setEnabled(false);
        cbo_idsubfamilia.addKeyListener(this);
        pnl.add(cbo_idsubfamilia, gbc);
        gbc.gridwidth=1;

        gbc.gridx = 0;
        gbc.gridy = 3;
        CLabel lblMarca = new CLabel("Marca");
        pnl.add(lblMarca, gbc);

        gbc.gridx = 1;
        gbc.gridwidth=5;
        cbo_idmarca = new JComboBox();
        cbo_idmarca.addKeyListener(this);
        cbo_idmarca.addActionListener(this);
        pnl.add(cbo_idmarca, gbc);
        gbc.gridwidth=1;

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
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        pnl.add(this.btn_buscardocumento, gbc);
        return pnlPrinc;
    }

    protected JPanel getPnlCenter() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        check = new JCheckBox("Seleccionar Todo");
        check.addItemListener(this);
        check.setFont(new Font("Verdana", 1, 11));
        check.addKeyListener(this);
        check.setHorizontalTextPosition(SwingConstants.LEFT);
        check.addFocusListener(this);
        check.setOpaque(false);
        pnlPrinc.add(check, BorderLayout.NORTH);

        modeltable = new SalidaAjusteTableModel();
        tblSearch = new CTable();
        tblSearch.setModel(modeltable);
        tblSearch.setAllTableNoEditable();
        tblSearch.setAllColumnNoResizable();
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

        scrollSearch = new JScrollPane(tblSearch, JScrollPane.VERTICAL_SCROLLBAR_ALWAYS, JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS);
        //scrollSearch.setBounds(10, 120, 855, 247);
        pnlPrinc.add(scrollSearch, BorderLayout.CENTER);
        return pnlPrinc;
    }

    protected JPanel getPnlSouth(Gif gif) {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        cbCancel = new JButton("Cancelar", gif.CANCEL16);
        cbCancel.setMnemonic('C');
        cbCancel.setHorizontalAlignment(SwingConstants.LEFT);
        cbCancel.setIconTextGap(10);
        cbCancel.addActionListener(this);
        cbCancel.setFont(new Font("Verdana", 1, 10));
        cbCancel.setOpaque(false);
        cbCancel.addKeyListener(this);
        cbCancel.setFocusPainted(false);
        pnl.add(cbCancel, BorderLayout.WEST);

        btn_Agregar = new JButton("Agregar", gif.ADD16);
        btn_Agregar.setMnemonic('B');
        btn_Agregar.setHorizontalAlignment(SwingConstants.LEFT);
        btn_Agregar.setIconTextGap(10);
        btn_Agregar.addActionListener(this);
        btn_Agregar.setFont(new Font("Verdana", 1, 10));
        btn_Agregar.setOpaque(false);
        btn_Agregar.addKeyListener(this);
        btn_Agregar.setFocusPainted(false);
        pnl.add(btn_Agregar, BorderLayout.EAST);
        return pnl;
    }

    protected void loadCombo() {
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
        if (e.getSource().equals(txt_serie)) {
            FormatObject.formatSerie((JTextField) e.getSource());
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
            check.setSelected(false);
            cargarTabla();
            check.setSelected(true);
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
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == btn_buscardocumento) {
            check.setSelected(false);
            cargarTabla();
            check.setSelected(true);
        }

        if (e.getSource() == dc_fechainicio.getCalendarButton()) {
            Calendar inicioCal = Calendar.getInstance();
            inicioCal.set(Integer.parseInt(frm.getAnio()), 0, 1, 0, 0);
            Calendar finCal = Calendar.getInstance();
            finCal.set(Integer.parseInt(frm.getAnio()), 11, 31, 23, 59);
            dc_fechainicio.setSelectableDateRange(inicioCal.getTime(), finCal.getTime());
            //dc_fechainicio.setSelectableDateRange(DateTime.format(0, 0, 0), dc_fechafin.getDate());
        }
        //dc_fechainicio.setSelectableDateRange(DateTime.format(100,0,1),dc_fechafin.getDate());

        if (e.getSource() == dc_fechafin.getCalendarButton()) {
            Calendar inicioCal = Calendar.getInstance();
            inicioCal.set(Integer.parseInt(frm.getAnio()), 0, 1, 0, 0);
            Calendar finCal = Calendar.getInstance();
            finCal.set(Integer.parseInt(frm.getAnio()), 11, 31, 23, 59);
            dc_fechafin.setSelectableDateRange(inicioCal.getTime(), finCal.getTime());
            //dc_fechafin.setSelectableDateRange(dc_fechainicio.getDate(), new Date());
        }
        //dc_fechafin.setSelectableDateRange(dc_fechainicio.getDate(),dc_fechafin.getMaxSelectableDate());

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

    public void obtenerDatos(int op) {
    }

    public void cargarTabla() {
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

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }
}
