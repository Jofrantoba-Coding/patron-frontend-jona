/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uibuscaringresoinventarioinicial;


import com.softcommerce.formularios.*;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import com.softcommerce.general.controles.JHInternal;
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
import java.beans.PropertyChangeEvent;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
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
import javax.swing.JComponent;
import javax.swing.KeyStroke;
import javax.swing.RowFilter;
import javax.swing.RowFilter.ComparisonType;
import javax.swing.table.TableRowSorter;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.general.tablas.BuscarOrdenCompraTableModel;
import com.softcommerce.util.FormatObject;
import java.util.Calendar;

public class UiBuscarIngresoInventarioInicial extends JDialog implements InterUiBuscarIngresoInventarioInicial, ActionListener, KeyListener, WindowListener, ItemListener, FocusListener, PropertyChangeListener, MouseListener {

    private static final long serialVersionUID = 1L;
    private JHInternal ari;
    private Component comp;

    private String id_empresa;
    private String id_localidad;
    private String id_punto_venta;
    private int indiceTabla;

    private JTabbedPane tabSearch;
    private BuscarOrdenCompraTableModel modeltblSearch;
    private TableRowSorter<BuscarOrdenCompraTableModel> modeloOrdenado;
    private CTable tblSearch;
    private JScrollPane scrollSearch;

    private JButton btn_Refrescar;
    private JButton btn_Agregar;
    private JButton cbCancel;

    private JComboBox cbEstadoDocumento;

    private JDateChooser dc_fechainicio;
    private JDateChooser dc_fechafin;

    private JTextField txtRuc;
    private JTextField txtRazonSocial;
    private JTextField txtCodigoDespacho;
    private JTextField txt_serie;
    private JTextField txt_preimpreso;

    private java.net.URL path;
    private Main frm;

    public UiBuscarIngresoInventarioInicial(Main arg0, JHInternal arg1, java.net.URL path) {
        super(arg0);
        frm = arg0;
        this.path = path;
        this.ari = arg1;
        initialize();
    }

    private void initialize() {
        addWindowListener(this);

        Gif gif = new Gif();

        JPanel pnl = new JPanel();
        pnl.setBackground(new Color(243, 248, 252));
        pnl.setOpaque(false);
        pnl.setLayout(null);

        modeltblSearch = new BuscarOrdenCompraTableModel();
        modeloOrdenado = new TableRowSorter<BuscarOrdenCompraTableModel>(modeltblSearch);
        tblSearch = new CTable();
        tblSearch.setRowSorter(modeloOrdenado);
        tblSearch.setModel(modeltblSearch);
        tblSearch.setAllTableNoEditable();
        tblSearch.setAllColumnNoResizable();
        tblSearch.setRendererColumnZero();

        tblSearch.setNoVisibleColumn(8);
        tblSearch.setNoVisibleColumn(9);

        tblSearch.setAllColumnPreferredWidth();
        tblSearch.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                obtenerDatos();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);

        scrollSearch = new JScrollPane(tblSearch, JScrollPane.VERTICAL_SCROLLBAR_ALWAYS, JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS);
        scrollSearch.setBounds(20, 115, 855, 245);
        pnl.add(scrollSearch);

        tblSearch.addKeyListener(this);
        tblSearch.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                    obtenerDatos();
                }
            }

        });

        JLabel lblCodigoDespacho = new JLabel("Código");
        lblCodigoDespacho.setBounds(20, 25, 40, 20);
        lblCodigoDespacho.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblCodigoDespacho);

        txtCodigoDespacho = new JTextField();
        txtCodigoDespacho.setBounds(72, 25, 90, 20);
        txtCodigoDespacho.addKeyListener(this);
        txtCodigoDespacho.setDocument(new IntegerDocument(10));
        txtCodigoDespacho.addFocusListener(this);
        txtCodigoDespacho.setFont(new Font("Garamond", 0, 14));
        pnl.add(txtCodigoDespacho);

        JLabel lblSerie = new JLabel("N° Documento");
        lblSerie.setBounds(190, 25, 70, 20);
        pnl.add(lblSerie);

        txt_serie = new JTextField();
        txt_serie.setBounds(265, 25, 30, 20);
        txt_serie.addKeyListener(this);
        txt_serie.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_serie.addFocusListener(this);
        FormatObject.formatJTextFieldSerie(txt_serie);
        txt_serie.setForeground(Color.BLACK);
        pnl.add(txt_serie);

        txt_preimpreso = new JTextField();
        txt_preimpreso.setBounds(300, 25, 80, 20);
        txt_preimpreso.addKeyListener(this);
        txt_preimpreso.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_preimpreso.addFocusListener(this);
        txt_preimpreso.setDocument(new IntegerDocument(10));
        txt_preimpreso.setForeground(Color.BLACK);
        pnl.add(txt_preimpreso);

        JLabel lblRazonSocial = new JLabel("R. Social");
        lblRazonSocial.setBounds(417, 25, 50, 20);
        pnl.add(lblRazonSocial);

        txtRazonSocial = new JTextField();
        txtRazonSocial.setBounds(467, 25, 350, 20);
        txtRazonSocial.addKeyListener(this);
        txtRazonSocial.setDocument(new UpperCaseNumberDocument(255));
        txtRazonSocial.addFocusListener(this);
        pnl.add(txtRazonSocial);

        JLabel lbl_RucCliente = new JLabel("RUC/DNI");
        lbl_RucCliente.setBounds(20, 55, 50, 20);
        pnl.add(lbl_RucCliente);

        txtRuc = new JTextField();
        txtRuc.setBounds(80, 55, 80, 20);
        txtRuc.addFocusListener(this);
        txtRuc.setDocument(new IntegerDocument(11));
        txtRuc.addKeyListener(this);
        pnl.add(txtRuc);

        JLabel lbl_familia = new JLabel("Estado");
        lbl_familia.setFont(new Font("Verdana", 0, 11));
        lbl_familia.setBounds(642, 55, 50, 20);
        pnl.add(lbl_familia);

        cbEstadoDocumento = new JComboBox();
        cbEstadoDocumento.setBounds(691, 55, 60, 20);
        cbEstadoDocumento.addItem("T");
        cbEstadoDocumento.addItem("PEN");
        cbEstadoDocumento.addItem("PAA");
        cbEstadoDocumento.addActionListener(this);
        cbEstadoDocumento.addKeyListener(this);
        pnl.add(cbEstadoDocumento);

        dc_fechainicio = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).addFocusListener(this);
        dc_fechainicio.setBounds(290, 55, 100, 20);
        dc_fechainicio.getJCalendar().addMouseListener(this);
        dc_fechainicio.getJCalendar().addFocusListener(this);
        dc_fechainicio.getJCalendar().addKeyListener(this);
        dc_fechainicio.getCalendarButton().addMouseListener(this);
        dc_fechainicio.getCalendarButton().addActionListener(this);
        dc_fechainicio.addPropertyChangeListener(this);
        dc_fechainicio.addMouseListener(this);
        dc_fechainicio.addKeyListener(this);
        dc_fechainicio.addFocusListener(this);
        KeyStroke keystroke21 = KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false);
        ActionListener action21 = new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).requestFocus();
            }
        };
        ((JTextField) dc_fechainicio.getDateEditor()).registerKeyboardAction(action21, keystroke21, JComponent.WHEN_FOCUSED);
        KeyStroke keystroke22 = KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false);
        ActionListener action22 = new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_fechainicio.getCalendarButton().doClick();
            }
        };
        ((JTextField) dc_fechainicio.getDateEditor()).registerKeyboardAction(action22, keystroke22, JComponent.WHEN_FOCUSED);
        pnl.add(dc_fechainicio);

        JLabel lblFechaInicio = new JLabel("Fecha Inicio");
        lblFechaInicio.setDisplayedMnemonic('c');
        lblFechaInicio.setLabelFor(dc_fechainicio);
        lblFechaInicio.setBounds(190, 55, 100, 20);
        pnl.add(lblFechaInicio);

        dc_fechafin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).addFocusListener(this);
        dc_fechafin.setBounds(502, 55, 100, 20);
        dc_fechafin.getJCalendar().addMouseListener(this);
        dc_fechafin.getJCalendar().addFocusListener(this);
        dc_fechafin.getJCalendar().addKeyListener(this);
        dc_fechafin.getCalendarButton().addMouseListener(this);
        dc_fechafin.getCalendarButton().addActionListener(this);
        dc_fechafin.addPropertyChangeListener(this);
        dc_fechafin.addMouseListener(this);
        dc_fechafin.addKeyListener(this);
        dc_fechafin.addFocusListener(this);
        KeyStroke keystroke24 = KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false);
        ActionListener action24 = new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                cbEstadoDocumento.requestFocus();
            }
        };
        ((JTextField) dc_fechafin.getDateEditor()).registerKeyboardAction(action24, keystroke24, JComponent.WHEN_FOCUSED);
        KeyStroke keystroke23 = KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false);
        ActionListener action23 = new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_fechafin.getCalendarButton().doClick();
            }
        };
        ((JTextField) dc_fechafin.getDateEditor()).registerKeyboardAction(action23, keystroke23, JComponent.WHEN_FOCUSED);
        pnl.add(dc_fechafin);

        JLabel lblFechaFin = new JLabel("Fecha Fin");
        lblFechaFin.setBounds(417, 55, 90, 20);
        lblFechaFin.setDisplayedMnemonic('a');
        lblFechaFin.setLabelFor(dc_fechafin);
        pnl.add(lblFechaFin);

        cbCancel = new JButton("Cancelar", gif.CANCEL16);
        cbCancel.setMnemonic('C');
        cbCancel.setHorizontalAlignment(SwingConstants.LEFT);
        cbCancel.setIconTextGap(10);
        cbCancel.addActionListener(this);
        cbCancel.setFont(new Font("Verdana", 1, 10));
        cbCancel.setOpaque(false);
        cbCancel.addKeyListener(this);
        cbCancel.setFocusPainted(false);
        cbCancel.setBounds(25, 370, 120, 25);
        pnl.add(cbCancel);

        btn_Refrescar = new JButton("Refrescar", gif.REFRESH16);
        btn_Refrescar.setMnemonic('B');
        btn_Refrescar.setHorizontalAlignment(SwingConstants.LEFT);
        btn_Refrescar.setIconTextGap(10);
        btn_Refrescar.addActionListener(this);
        btn_Refrescar.setFont(new Font("Verdana", 1, 10));
        btn_Refrescar.setOpaque(false);
        btn_Refrescar.addKeyListener(this);
        btn_Refrescar.setFocusPainted(false);
        btn_Refrescar.setBounds(600, 370, 120, 25);
        pnl.add(btn_Refrescar);

        btn_Agregar = new JButton("Agregar", gif.ADD16);
        btn_Agregar.setMnemonic('B');
        btn_Agregar.setHorizontalAlignment(SwingConstants.LEFT);
        btn_Agregar.setIconTextGap(10);
        btn_Agregar.addActionListener(this);
        btn_Agregar.setFont(new Font("Verdana", 1, 10));
        btn_Agregar.setOpaque(false);
        btn_Agregar.addKeyListener(this);
        btn_Agregar.setFocusPainted(false);
        btn_Agregar.setBounds(740, 370, 120, 25);
        pnl.add(btn_Agregar);

        tabSearch = new JTabbedPane();
        tabSearch.setFocusable(false);
        tabSearch.add("", pnl);
        tabSearch.setBorder(new EmptyBorder(5, 5, 5, 5));
        tabSearch.setBackground(new Color(243, 248, 252));

        setBackground(new Color(245, 245, 245));
        setTitle("Buscar Orden de Compra");
        setContentPane(tabSearch);
        setModal(true);
        setResizable(false);
        setSize(915, 475);
        ComponentToolKit.centerComponentPosicion(this);
    }

    public void cargarTabla(
            String id_empresa, String id_localidad, String id_punto_venta, Component comp, int indiceTabla
    ) {
        txtCodigoDespacho.setText("");
        txtRuc.setText("");
        txtRazonSocial.setText("");
        txt_serie.setText("");
        txt_preimpreso.setText("");
        dc_fechainicio.setDate(frm.getFechaInicio());
        dc_fechafin.setDate(frm.getFechaFin());
        cbEstadoDocumento.setSelectedIndex(0);

        this.id_empresa = id_empresa;
        this.id_localidad = id_localidad;
        this.id_punto_venta = id_punto_venta;
        this.comp = comp;
        this.indiceTabla = indiceTabla;

        RnRegContaCab regla = new RnRegContaCab(path);
        modeloOrdenado.setRowFilter(null);
        modeltblSearch.clearTable();
        modeltblSearch.agregarVectorRegContaCab(regla.listarOrdenCompra("", id_empresa, "", "", "I", id_punto_venta, "Y", frm.getAnio()));
        tblSearch.setAllColumnPreferredWidth();

        ComponentToolKit.centerComponentPosicion(this);
        txt_preimpreso.requestFocus();
        setVisible(true);
    }

    @Override
    public void windowOpened(WindowEvent e) {
        txt_preimpreso.requestFocus();
    }

    @Override
    public void windowClosing(WindowEvent e) {
        dispose();
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txtCodigoDespacho)
                    || (e.getSource() == txt_serie)
                    || (e.getSource() == txt_preimpreso)
                    || (e.getSource() == txtRazonSocial)
                    || (e.getSource() == txtRuc)
                    || (e.getSource() == ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()))
                    || (e.getSource() == ((JTextFieldDateEditor) dc_fechafin.getDateEditor()))) {
                filtrar();
            }
        }
    }

    public void filtrar() {
        modeloOrdenado.setRowFilter(getFilter());
        tblSearch.setAllColumnPreferredWidth();

        if (tblSearch.getRowCount() > 0) {
            tblSearch.setRowSelectionInterval(0, 0);
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            setVisible(false);
        }

        if (e.getKeyChar() == '\n') {
            if (txtCodigoDespacho == e.getSource()) {
                txt_serie.requestFocus();
            }

            if (txt_serie == e.getSource()) {
                txt_preimpreso.requestFocus();
            }

            if (txt_preimpreso == e.getSource()) {
                txtRazonSocial.requestFocus();
            }

            if (txtRazonSocial == e.getSource()) {
                txtRuc.requestFocus();
            }

            if (txtRuc == e.getSource()) {
                ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).requestFocus();
            }

            if (cbEstadoDocumento == e.getSource()) {
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
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txtCodigoDespacho) {
            txtCodigoDespacho.selectAll();
        }

        if (e.getSource() == ((JTextFieldDateEditor) dc_fechainicio.getDateEditor())) {
            ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).selectAll();
        }

        if (e.getSource() == ((JTextFieldDateEditor) dc_fechafin.getDateEditor())) {
            ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).selectAll();
        }

        if (e.getSource() == txtRazonSocial) {
            txtRazonSocial.selectAll();
        }

        if (e.getSource() == txtRuc) {
            txtRuc.selectAll();
        }

        if (e.getSource() == txt_serie) {
            txt_serie.selectAll();
        }

        if (e.getSource() == txt_preimpreso) {
            txt_preimpreso.selectAll();
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
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

        if (e.getSource() == btn_Refrescar) {
            cargarTabla(id_empresa, id_localidad, id_punto_venta, comp, indiceTabla);
        }

        if (cbCancel == e.getSource()) {
            setVisible(false);
        }

        if (e.getSource() == btn_Agregar) {
            obtenerDatos();
        }

        if (e.getSource() == cbEstadoDocumento) {
            filtrar();
        }
    }

    public RowFilter<Object, Object> getFilter() {
        List<RowFilter<Object, Object>> filters = new ArrayList<RowFilter<Object, Object>>();

        if (txt_serie.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_serie.getText().trim() + ".*", 8));
        }

        if (txt_preimpreso.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_preimpreso.getText().trim() + ".*", 9));
        }

        if (cbEstadoDocumento.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter("^" + cbEstadoDocumento.getSelectedItem().toString().trim(), 7));
        }

        if (txtRazonSocial.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtRazonSocial.getText().trim() + ".*", 2));
        }

        if (txtCodigoDespacho.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtCodigoDespacho.getText().trim() + ".*", 0));
        }

        if (txtRuc.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtRuc.getText().trim() + ".*", 3));
        }

        if (!((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText().equals("__/__/____")
                && !((JTextFieldDateEditor) dc_fechafin.getDateEditor()).getText().equals("__/__/____")) {
            if (DateTime.isValidDate(((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText())
                    && DateTime.isValidDate(((JTextFieldDateEditor) dc_fechafin.getDateEditor()).getText())) {
                filters.add(RowFilter.dateFilter(ComparisonType.AFTER, DateTime.getDateMinusOrPlus(dc_fechainicio.getDate(), -1), 4));
                filters.add(RowFilter.dateFilter(ComparisonType.BEFORE, DateTime.getDateMinusOrPlus(dc_fechafin.getDate(), 1), 4));
            }
        }

        RowFilter<Object, Object> fooBarFilter = RowFilter.andFilter(filters);

        return fooBarFilter;
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource().equals(txt_serie)) {
            FormatObject.formatSerie((JTextField) e.getSource());
            filtrar();
        }

        if (e.getSource() == txt_preimpreso && txt_preimpreso.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_preimpreso.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txt_preimpreso.setText(nuevaserie);

            filtrar();
        }
    }

    public void obtenerDatos() {
        int row = tblSearch.getSelectedRow();

        if (row >= 0) {
            ari.setValueSearch(tblSearch.getValueAt(row, indiceTabla), comp);
            dispose();
        }
    }

    @Override
    public void propertyChange(PropertyChangeEvent evt) {
        if ((evt.getSource() == dc_fechainicio)
                || (evt.getSource() == dc_fechafin)) {
            filtrar();
        }
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
    public void itemStateChanged(ItemEvent e) {
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
}
