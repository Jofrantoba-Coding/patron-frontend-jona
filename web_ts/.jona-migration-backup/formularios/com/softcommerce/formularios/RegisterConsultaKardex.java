package com.softcommerce.formularios;

import com.softcommerce.beans.TipoMovInventario;
import com.softcommerce.beans.Item;
import com.softcommerce.beans.Kardex;
import com.softcommerce.beans.ContaItem;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import com.softcommerce.general.herramientas.CFunciones;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.iconos.Gif;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.ItemEvent;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.beans.PropertyChangeEvent;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.border.Border;
import javax.swing.border.EmptyBorder;
import javax.swing.border.TitledBorder;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import java.awt.event.FocusListener;
import java.awt.event.ItemListener;
import java.beans.PropertyChangeListener;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JTabbedPane;
import javax.swing.SwingConstants;
import javax.swing.table.DefaultTableCellRenderer;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.reglasnegocio.RnTipoMovInventario;
import com.softcommerce.report.Reporte;
import com.softcommerce.general.tablas.KardexTableModel;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.util.render.CellRenderer;
import com.softcommerce.util.ExportarToExcel;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.Calendar;
import javax.swing.JOptionPane;

public class RegisterConsultaKardex 
        extends JDialog 
        implements KeyListener, ActionListener, MouseListener, ListSelectionListener, FocusListener, ItemListener, PropertyChangeListener {

    private static final long serialVersionUID = 1L;
    private JComboBox cbo_tipo;
    private JComboBox cbo_tipoMovimiento;
    private List<TipoMovInventario> xTipoMovimiento;
    private JPanel pnl_summary;
    private JTextField txt_CodAltItem;
    private JTextField txt_Familia;
    private JTextField txt_Item;
    private JTextField txt_UMStock;
    private JTextField txt_Marca;
    private JTextField txt_SubFamilia;
    private JTextField txt_valorEntrada;
    private JTextField txt_valorSalida;
    private JTextField txt_valorSaldo;
    private JTextField txt_montoEntrada;
    private JTextField txt_montoSalida;
    private JTextField txt_montoSaldo;
    private JButton btn_exportar_excel;
    private JButton btn_salir;
    private JButton btn_generar_reporte;
    private JButton btn_buscar;
    private JTabbedPane tabb;
    private KardexTableModel mdl_stock;
    private CTable tbl_stock;
    private String idalmacen;
    private String iditem;
    private JCheckBox chk_valorado;
    private java.net.URL path;
    private JDateChooser dc_fechainicio;
    private JDateChooser dc_fechafin;
    private Main frame;

    public RegisterConsultaKardex(Main frm, java.net.URL path) {
        super(frm, "Kardex");
        frame = frm;
        this.path = path;
        inicialize();
    }

    private void inicialize() {
        addKeyListener(this);

        Gif gif = new Gif();

        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());

        JLabel lblTitle = new JLabel("Detalle Kardex");
        lblTitle.setOpaque(true);
        lblTitle.setFont(new Font(lblTitle.getFont().getFontName(), 1, 14));
        lblTitle.setForeground(new Color(255, 255, 255));
        lblTitle.setBackground(new Color(35, 117, 152));
        lblTitle.setPreferredSize(new Dimension(0, 25));
        lblTitle.setBorder(new EmptyBorder(0, 10, 0, 0));
        pnl.add(lblTitle, BorderLayout.NORTH);

        JPanel pnlVentaDirecta = new JPanel();
        pnlVentaDirecta.setLayout(null);
        pnlVentaDirecta.setBackground(new Color(245, 245, 245));

        Border borderDetalleItem = BorderFactory.createTitledBorder(null, "DETALLE DE ITEM", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, null, Color.BLACK);

        JPanel pnl_item = new JPanel();
        pnl_item.setLayout(null);
        pnl_item.setBorder(borderDetalleItem);
        pnl_item.setOpaque(false);

        JLabel lbl_CodAltItem = new JLabel("CODIGO");
        lbl_CodAltItem.setBounds(8, 25, 60, 20);
        pnl_item.add(lbl_CodAltItem);

        txt_CodAltItem = new JTextField();
        txt_CodAltItem.setBounds(70, 25, 50, 20);
        txt_CodAltItem.addKeyListener(this);
        txt_CodAltItem.setEditable(false);
        pnl_item.add(txt_CodAltItem);

        JLabel lbl_Item = new JLabel("DESCRIPCION");
        lbl_Item.setBounds(230, 25, 80, 20);
        pnl_item.add(lbl_Item);

        txt_Item = new JTextField();
        txt_Item.setBounds(315, 25, 350, 20);
        txt_Item.setDocument(new UpperCaseNumberDocument());
        txt_Item.setEditable(false);
        txt_Item.addKeyListener(this);
        pnl_item.add(txt_Item);

        JLabel lbl_UMStock = new JLabel("UM");
        lbl_UMStock.setBounds(680, 25, 30, 20);
        pnl_item.add(lbl_UMStock);

        txt_UMStock = new JTextField();
        txt_UMStock.setBounds(730, 25, 100, 20);
        txt_UMStock.setDocument(new UpperCaseNumberDocument());
        txt_UMStock.addKeyListener(this);
        txt_UMStock.setEditable(false);
        pnl_item.add(txt_UMStock);

        JLabel lbl_familia = new JLabel("FAMILIA");
        lbl_familia.setBounds(8, 25 + 30, 60, 20);
        pnl_item.add(lbl_familia);

        txt_Familia = new JTextField();
        txt_Familia.setBounds(70, 25 + 30, 140, 20);
        txt_Familia.addKeyListener(this);
        txt_Familia.setEditable(false);
        pnl_item.add(txt_Familia);

        JLabel lbl_SubFamilia = new JLabel("SUBFAMILIA");
        lbl_SubFamilia.setBounds(230, 55, 80, 20);
        pnl_item.add(lbl_SubFamilia);

        txt_SubFamilia = new JTextField();
        txt_SubFamilia.setBounds(315, 25 + 30, 150 - 10, 20);
        txt_SubFamilia.setDocument(new UpperCaseNumberDocument());
        txt_SubFamilia.setEditable(false);
        txt_SubFamilia.addKeyListener(this);
        pnl_item.add(txt_SubFamilia);

        JLabel lbl_Marca = new JLabel("MARCA");
        lbl_Marca.setBounds(680, 55, 45, 20);
        pnl_item.add(lbl_Marca);

        txt_Marca = new JTextField();
        txt_Marca.setBounds(730, 25 + 30, 150 - 30, 20);
        txt_Marca.setDocument(new UpperCaseNumberDocument());
        txt_Marca.setEditable(false);
        txt_Marca.addKeyListener(this);
        pnl_item.add(txt_Marca);

        JLabel lbl_Tipo = new JLabel("TIPO");
        lbl_Tipo.setBounds(8, 85, 60, 20);
        pnl_item.add(lbl_Tipo);

        cbo_tipo = new JComboBox();
        cbo_tipo.setBounds(70, 85, 130, 20);
        cbo_tipo.addActionListener(this);
        cbo_tipo.addKeyListener(this);
        pnl_item.add(cbo_tipo);

        JLabel lbl_TipoMovimiento = new JLabel("MOVIMIENTO");
        lbl_TipoMovimiento.setBounds(230, 85, 70, 20);
        pnl_item.add(lbl_TipoMovimiento);

        cbo_tipoMovimiento = new JComboBox();
        cbo_tipoMovimiento.setBounds(315, 85, 250, 20);
        cbo_tipoMovimiento.addActionListener(this);
        cbo_tipoMovimiento.addKeyListener(this);
        pnl_item.add(cbo_tipoMovimiento);

        JLabel lblFechaInicio = new JLabel("F INICIO");
        lblFechaInicio.setDisplayedMnemonic('c');
        lblFechaInicio.setBounds(8, 115, 45, 20);
        pnl_item.add(lblFechaInicio);

        dc_fechainicio = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dc_fechainicio.setBounds(70, 115, 90, 20);
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
        pnl_item.add(dc_fechainicio);

        JLabel lblFechaFin = new JLabel("F FIN");
        lblFechaFin.setBounds(230, 115, 40, 20);
        lblFechaFin.setDisplayedMnemonic('a');
        pnl_item.add(lblFechaFin);

        dc_fechafin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dc_fechafin.setBounds(315, 115, 90, 20);
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
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dc_fechafin.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_fechafin.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        pnl_item.add(dc_fechafin);

        btn_buscar = new JButton(gif.SEARCH16);
        btn_buscar.setBounds(800, 85, 40, 20);
        btn_buscar.setHorizontalTextPosition(SwingConstants.LEFT);
        btn_buscar.setToolTipText("Filtrar Por Período");
        btn_buscar.setContentAreaFilled(true);
        btn_buscar.setBorderPainted(true);
        btn_buscar.setFocusable(true);
        btn_buscar.setFocusPainted(false);
        btn_buscar.addActionListener(this);
        btn_buscar.addKeyListener(this);
        btn_buscar.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        pnl_item.add(this.btn_buscar);


        pnl_item.setBounds(77, 5, 860, 145);
        pnlVentaDirecta.add(pnl_item);

        chk_valorado = new JCheckBox("VER KARDEX VALORADO");
        chk_valorado.setBounds(75, 150, 170, 20);
        chk_valorado.addItemListener(this);
        chk_valorado.addKeyListener(this);
        chk_valorado.setHorizontalTextPosition(SwingConstants.LEFT);
        chk_valorado.addFocusListener(this);
        chk_valorado.setOpaque(false);
        pnlVentaDirecta.add(chk_valorado);

        JPanel pnl_2 = new JPanel();
        pnl_2.setLayout(null);
        pnl_2.setOpaque(false);

        btn_salir = new JButton("Salir", gif.CANCEL16);
        btn_salir.setMnemonic('C');
        btn_salir.setHorizontalAlignment(SwingConstants.LEFT);
        btn_salir.setIconTextGap(10);
        btn_salir.addActionListener(this);
        btn_salir.setFont(new Font("Verdana", 1, 10));
        btn_salir.setOpaque(false);
        btn_salir.addKeyListener(this);
        btn_salir.setFocusPainted(false);
        btn_salir.setBounds(5, 5, 120, 25);
        pnl_2.add(btn_salir);

        btn_exportar_excel = new JButton("Exportar a excel", gif.EXCEL);
        btn_exportar_excel.setMnemonic('B');
        btn_exportar_excel.setHorizontalAlignment(SwingConstants.LEFT);
        btn_exportar_excel.setIconTextGap(10);
        btn_exportar_excel.addActionListener(this);
        btn_exportar_excel.setFont(new Font("Verdana", 1, 10));
        btn_exportar_excel.setOpaque(false);
        btn_exportar_excel.addKeyListener(this);
        btn_exportar_excel.setFocusPainted(false);
        btn_exportar_excel.setBounds(635, 5, 165, 25);
        pnl_2.add(btn_exportar_excel);

        btn_generar_reporte = new JButton("Generar Reporte", gif.REPORT16);
        btn_generar_reporte.setMnemonic('B');
        btn_generar_reporte.setHorizontalAlignment(SwingConstants.LEFT);
        btn_generar_reporte.setIconTextGap(10);
        btn_generar_reporte.addActionListener(this);
        btn_generar_reporte.setFont(new Font("Verdana", 1, 10));
        btn_generar_reporte.setOpaque(false);
        btn_generar_reporte.addKeyListener(this);
        btn_generar_reporte.setFocusPainted(false);
        btn_generar_reporte.setBounds(805, 5, 165, 25);
        pnl_2.add(btn_generar_reporte);

        pnl_2.setBounds(5, 455, 1330, 40);
        pnlVentaDirecta.add(pnl_2);

        Border borderpnl_summary = BorderFactory.createTitledBorder(null, "", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);

        pnl_summary = new JPanel();
        pnl_summary.setLayout(null);
        pnl_summary.setBorder(borderpnl_summary);
        pnl_summary.setOpaque(false);

        JLabel lbl_montoEntrada = new JLabel("C Entrada");
        lbl_montoEntrada.setBounds(8, 5, 90, 20);
        pnl_summary.add(lbl_montoEntrada);

        txt_montoEntrada = new JTextField();
        txt_montoEntrada.setBounds(72, 5, 70, 20);
        txt_montoEntrada.addKeyListener(this);
        txt_montoEntrada.setText("0.0");
        txt_montoEntrada.setEditable(false);
        pnl_summary.add(txt_montoEntrada);

        JLabel lbl_montoSalida = new JLabel("C Salida");
        lbl_montoSalida.setBounds(170, 5, 78, 20);
        pnl_summary.add(lbl_montoSalida);

        txt_montoSalida = new JTextField();
        txt_montoSalida.setBounds(224, 5, 70, 20);
        txt_montoSalida.addKeyListener(this);
        txt_montoSalida.setText("0.0");
        txt_montoSalida.setEditable(false);
        pnl_summary.add(txt_montoSalida);

        JLabel lbl_montoSaldo = new JLabel("C Saldo");
        lbl_montoSaldo.setBounds(340, 5, 72, 20);
        pnl_summary.add(lbl_montoSaldo);

        txt_montoSaldo = new JTextField();
        txt_montoSaldo.setBounds(389, 5, 70, 20);
        txt_montoSaldo.addKeyListener(this);
        txt_montoSaldo.setEditable(false);
        txt_montoSaldo.setText("0.0");
        pnl_summary.add(txt_montoSaldo);

        JLabel lbl_valorEntrada = new JLabel("V Entrada");
        lbl_valorEntrada.setBounds(505, 5, 70, 20);
        pnl_summary.add(lbl_valorEntrada);

        txt_valorEntrada = new JTextField();
        txt_valorEntrada.setBounds(570, 5, 70, 20);
        txt_valorEntrada.addKeyListener(this);
        txt_valorEntrada.setEditable(false);
        txt_valorEntrada.setText("0.0");
        pnl_summary.add(txt_valorEntrada);

        JLabel lbl_valorSalida = new JLabel("V Salida");
        lbl_valorSalida.setBounds(685, 5, 100, 20);
        pnl_summary.add(lbl_valorSalida);

        txt_valorSalida = new JTextField();
        txt_valorSalida.setBounds(735, 5, 70, 20);
        txt_valorSalida.addKeyListener(this);
        txt_valorSalida.setText("0.0");
        txt_valorSalida.setEditable(false);
        pnl_summary.add(txt_valorSalida);

        JLabel lbl_valorSaldo = new JLabel("V Saldo");
        lbl_valorSaldo.setBounds(853, 5, 60, 20);
        pnl_summary.add(lbl_valorSaldo);

        txt_valorSaldo = new JTextField();
        txt_valorSaldo.setBounds(913, 5, 70, 20);
        txt_valorSaldo.addKeyListener(this);
        txt_valorSaldo.setEditable(false);
        txt_valorSaldo.setText("0.0");
        pnl_summary.add(txt_valorSaldo);

        pnl_summary.setBounds(8, 420, 985, 30);
        pnl_summary.setVisible(false);
        pnlVentaDirecta.add(pnl_summary);

        JPanel pnlProducto = new JPanel();
        pnlProducto.setLayout(new BorderLayout());
        pnlProducto.setOpaque(false);

        mdl_stock = new KardexTableModel();
        tbl_stock = new CTable();
        tbl_stock.setModel(mdl_stock);
        tbl_stock.getSelectionModel().addListSelectionListener(this);
        tbl_stock.setAllColumnPreferredWidth();
        tbl_stock.setFont(new Font(Font.SANS_SERIF, 0, 9));
        //tbl_stock.setAllColumnNoResizable();
        //tbl_stock.setRendererColumnZero();
        tbl_stock.setAllTableNoEditable();
        tbl_stock.addMouseListener(this);
        tbl_stock.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                btn_generar_reporte.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);
        DefaultTableCellRenderer rendererDireita = new DefaultTableCellRenderer();
        rendererDireita.setHorizontalAlignment(SwingConstants.RIGHT);
        tbl_stock.setAllColumnPreferredWidth();
        tbl_stock.setNoVisibleColumn(7);
        tbl_stock.setNoVisibleColumn(8);
        tbl_stock.setNoVisibleColumn(9);
        tbl_stock.setNoVisibleColumn(10);
        CellRenderer CellRenderer = new CellRenderer();
        tbl_stock.setDefaultRenderer(String.class, CellRenderer);
        tbl_stock.setDefaultRenderer(BigDecimal.class, CellRenderer);
        tbl_stock.setDefaultRenderer(java.sql.Date.class, CellRenderer);
        tabb = new JTabbedPane();
        tabb.add(new JScrollPane(tbl_stock), "KARDEX");
        tabb.setBounds(10, 160, 965, 280);

        pnlVentaDirecta.add(tabb);

        pnl.add(pnlVentaDirecta, BorderLayout.CENTER);

        setContentPane(pnl);
        setSize(1020, 555);
        setModal(true);
        ComponentToolKit.centerComponentPosicion(this);
        setResizable(false);
    }

    public void showKardex(String iditem, String idalmacen) {
        this.iditem = iditem;
        this.idalmacen = idalmacen;
        chk_valorado.setSelected(false);
        Calendar inicioCal = Calendar.getInstance();
        inicioCal.set(Integer.parseInt(frame.getAnio()), 0, 1, 0, 0);
        Calendar finCal = Calendar.getInstance();
        finCal.set(Integer.parseInt(frame.getAnio()), 11, 31, 23, 59);
        dc_fechainicio.setDate(inicioCal.getTime());
        dc_fechafin.setDate(finCal.getTime());
        dc_fechainicio.setSelectableDateRange(inicioCal.getTime(), finCal.getTime());
        dc_fechafin.setSelectableDateRange(inicioCal.getTime(), finCal.getTime());
        dc_fechainicio.updateUI();
        dc_fechafin.updateUI();
        loadTipo();
        loadDatosItem();
        cargarTablaKardex();
        calcularImportes();
        setVisible(true);
    }

    public void loadTipo() {
        cbo_tipo.addItem("T");
        cbo_tipo.addItem("ENTRADA");
        cbo_tipo.addItem("SALIDA");
        cbo_tipo.setSelectedIndex(0);
    }

    public void loadTipoMovimiento(String xCodTipo) {
        try {
            RnTipoMovInventario regla_TipoMov = new RnTipoMovInventario(path);

            if (xTipoMovimiento != null) {
                xTipoMovimiento.clear();
            } else {
                xTipoMovimiento = new ArrayList<TipoMovInventario>();
            }

            TipoMovInventario t = new TipoMovInventario();
            t.setTipo(xCodTipo.equals("ENTRADA") ? "E" : "S");

            xTipoMovimiento.addAll(regla_TipoMov.listar(t));

            cbo_tipoMovimiento.removeAllItems();
            cbo_tipoMovimiento.addItem("T");

            for (Integer i = 0; i < xTipoMovimiento.size(); i++) {
                cbo_tipoMovimiento.addItem(xTipoMovimiento.get(i).getDescripcion());
            }

            cbo_tipoMovimiento.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadDatosItem() {
        try {
            Item a = new Item();
            a.setId_item(iditem);
            a.setNum_final(-1);
            a.setNum_inicial(-1);

            RnItem regla = new RnItem(path);

            List<Item> item = regla.listar2(a);

            if (item != null) {
                Item itembean = item.get(0);

                txt_CodAltItem.setText(itembean.getId_item());
                txt_Familia.setText(itembean.getFamilia());
                txt_SubFamilia.setText(itembean.getSubfamilia());
                txt_Item.setText(itembean.getDescripcion());
                txt_Marca.setText(itembean.getMarca());
                txt_UMStock.setText(itembean.getAbrevumstock());
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void cargarTablaKardex() {
        try {
            ContaItem rci = new ContaItem();

            if (!((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText().equals("__/__/____")
                    && !((JTextFieldDateEditor) dc_fechafin.getDateEditor()).getText().equals("__/__/____")) {
                if (DateTime.isValidDate(((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText())
                        && DateTime.isValidDate(((JTextFieldDateEditor) dc_fechafin.getDateEditor()).getText())) {
                    rci.setF_inicio(dc_fechainicio.getDate());
                    rci.setF_fin(dc_fechafin.getDate());
                } else {
                    rci.setF_inicio(DateTime.format(1901, 0, 1));
                    rci.setF_fin(DateTime.format(1901, 0, 1));
                }
            }

            rci.setId_item(iditem);
            rci.setId_almacen(idalmacen);
            rci.setTipo(cbo_tipo.getSelectedIndex() > 0 ? (cbo_tipo.getSelectedItem().toString().equalsIgnoreCase("ENTRADA") ? "E" : "S") : "");
            rci.setId_tipo_movimiento(cbo_tipoMovimiento.getSelectedIndex() > 0 ? xTipoMovimiento.get(cbo_tipoMovimiento.getSelectedIndex() - 1).getIdTipoMov() : "");
            rci.setAnio(frame.getAnio());
            RnRegContaCab regla = new RnRegContaCab(path);
            mdl_stock.clearTable();
            mdl_stock.agregarVectorKardex(regla.listarPorPeriodo(rci));

            tbl_stock.setAllColumnPreferredWidth();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        boolean isSelected;

        isSelected = (e.getStateChange() == ItemEvent.SELECTED);

        if (e.getItemSelectable() == chk_valorado) {
            mostrarStockValorado(!isSelected);
        }
    }

    public void calcularImportes() {
        txt_montoEntrada.setText("0.0");
        txt_montoSalida.setText("0.0");
        txt_montoSaldo.setText("0.0");
        txt_valorEntrada.setText("0.0");
        txt_valorSalida.setText("0.0");
        txt_valorSaldo.setText("0.0");

        double montoEntrada = 0.0;
        double montoSalida = 0.0;
        double montoSaldo = 0.0;
        double valorEntrada = 0.0;
        double valorSalida = 0.0;
        double valorSaldo = 0.0;

        for (int i = 0; i < mdl_stock.getRowCount(); i++) {
            Kardex kardex = mdl_stock.getKardex(i);

            montoEntrada = montoEntrada + kardex.getCantentrada();
            montoSalida = montoSalida + kardex.getCantsalida();
            valorEntrada = valorEntrada + kardex.getMontoentrada();
            valorSalida = valorSalida + kardex.getMontosalida();
        }

        double montoEntradaRedondeado = CFunciones.redondea(montoEntrada, 2);
        double montoSalidaRedondeado = CFunciones.redondea(montoSalida, 2);
        double valorEntradaRedondeado = CFunciones.redondea(valorEntrada, 2);
        double valorSalidaRedondeado = CFunciones.redondea(valorSalida, 2);

        txt_montoEntrada.setText(String.valueOf(montoEntradaRedondeado));
        txt_montoSalida.setText(String.valueOf(montoSalidaRedondeado));
        txt_valorEntrada.setText(String.valueOf(valorEntradaRedondeado));
        txt_valorSalida.setText(String.valueOf(valorSalidaRedondeado));

        montoSaldo = montoEntradaRedondeado - montoSalidaRedondeado;
        valorSaldo = valorEntradaRedondeado - valorSalidaRedondeado;

        double montoSaldoRedondeado = CFunciones.redondea(montoSaldo, 2);
        double valorSaldoRedondeado = CFunciones.redondea(valorSaldo, 2);

        txt_montoSaldo.setText(String.valueOf(montoSaldoRedondeado));
        txt_valorSaldo.setText(String.valueOf(valorSaldoRedondeado));
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }
    }

    @Override
    public void propertyChange(PropertyChangeEvent evt) {
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == dc_fechainicio.getCalendarButton()) {
            Calendar inicioCal = Calendar.getInstance();
            inicioCal.set(Integer.parseInt(frame.getAnio()), 0, 1, 0, 0);
            Calendar finCal = Calendar.getInstance();
            finCal.set(Integer.parseInt(frame.getAnio()), 11, 31, 23, 59);
            dc_fechainicio.setSelectableDateRange(inicioCal.getTime(), finCal.getTime());
            //dc_fechainicio.setSelectableDateRange(DateTime.format(0,0,0),dc_fechafin.getDate());
        }

        if (e.getSource() == dc_fechafin.getCalendarButton()) {
            Calendar inicioCal = Calendar.getInstance();
            inicioCal.set(Integer.parseInt(frame.getAnio()), 0, 1, 0, 0);
            Calendar finCal = Calendar.getInstance();
            finCal.set(Integer.parseInt(frame.getAnio()), 11, 31, 23, 59);
            dc_fechafin.setSelectableDateRange(inicioCal.getTime(), finCal.getTime());
            //dc_fechafin.setSelectableDateRange(dc_fechainicio.getDate(),new Date());
        }

        if (cbo_tipo == e.getSource()) {
            if (cbo_tipo.getItemCount() > 0) {
                if (cbo_tipo.getSelectedIndex() == 0) {
                    cbo_tipoMovimiento.removeAllItems();
                    cbo_tipoMovimiento.setEnabled(false);
                } else {
                    cbo_tipoMovimiento.setEnabled(true);
                    loadTipoMovimiento(cbo_tipo.getSelectedItem().toString());
                }
            }
        }

        if (e.getSource() == btn_salir) {
            dispose();
        }

        if (e.getSource() == btn_generar_reporte) {
            generarReporte(false);
        }

        if (e.getSource() == btn_exportar_excel) {
            //generarReporte(true);
            try {
                File archivo = File.createTempFile("Kardex" + (new Date()).getTime(), ".xlsx");
                archivo.deleteOnExit();
                ExportarToExcel export = new ExportarToExcel(archivo, tbl_stock);
                if (export.exportarJTableToExcel()) {
                    JOptionPane.showMessageDialog(null, "Reporte Generado Correctamente");
                }
            } catch (IOException ex) {
                JOptionPane.showMessageDialog(null, ex.getMessage());
            }
        }


        if (e.getSource() == btn_buscar) {
            cargarTablaKardex();
        }

    }

    public void generarReporte(boolean flag) {
        try {
            Reporte report = new Reporte(path);
            report.generarReporte(chk_valorado.isSelected() ? "StockValorado" : "Stock", iditem, idalmacen, "", "", "", "", true, flag,
                    "Reporte Kardex");
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, ex.toString());
        }
    }

    public void mostrarStockValorado(boolean valor) {
        pnl_summary.setVisible(!valor);

        if (valor) {
            tabb.setBounds(8, 173, 1000, 280);
        } else {
            tabb.setBounds(8, 173, 1000, 238);
        }
    }

    @Override
    public void mouseClicked(MouseEvent e) {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyReleased(KeyEvent e) {
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
    public void valueChanged(ListSelectionEvent e) {
    }

    @Override
    public void focusGained(FocusEvent e) {
    }

    @Override
    public void focusLost(FocusEvent e) {
    }
}