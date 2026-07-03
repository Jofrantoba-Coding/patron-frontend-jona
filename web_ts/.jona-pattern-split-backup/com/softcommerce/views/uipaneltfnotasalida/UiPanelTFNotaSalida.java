/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipaneltfnotasalida;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanEstadoDocumento;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.Usuario;
import com.toedter.calendar.JDateChooser;
import javax.swing.RowFilter.ComparisonType;
import com.toedter.calendar.JTextFieldDateEditor;
import com.softcommerce.general.controles.ControlView;
import java.awt.event.ItemEvent;
import java.beans.PropertyChangeEvent;
import java.util.ArrayList;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.border.LineBorder;
import javax.swing.event.ListSelectionEvent;
import com.softcommerce.general.controles.CTable;
import java.awt.BorderLayout;
import javax.swing.JScrollPane;
import javax.swing.table.TableRowSorter;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.report.Reporte;
import com.softcommerce.general.controles.PopupMenuView;
import java.awt.event.WindowListener;
import javax.swing.event.ListSelectionListener;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.herramientas.DateTime;
import java.awt.event.ActionListener;
import java.awt.event.FocusListener;
import java.awt.event.WindowEvent;
import java.awt.event.KeyListener;
import java.awt.event.ActionEvent;
import java.awt.event.FocusEvent;
import java.awt.event.KeyEvent;
import javax.swing.JDesktopPane;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.RowSelection;
import com.softcommerce.general.controles.View;
import com.softcommerce.formularios.BuscarSalidasEntradas;
import com.softcommerce.formularios.RegisterNotaSalida;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.iconos.Gif;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.event.ItemListener;
import java.awt.event.KeyAdapter;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.beans.PropertyChangeListener;
import java.util.Date;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JOptionPane;
import javax.swing.KeyStroke;
import javax.swing.RowFilter;
import javax.swing.SwingConstants;
import javax.swing.event.InternalFrameEvent;
import javax.swing.event.InternalFrameListener;
import com.softcommerce.reglasnegocio.RnEstadoDocumento;
import com.softcommerce.general.tablas.RecojoTableModel;
import com.softcommerce.reglasnegocio.RnMovInventarioCab;
import com.softcommerce.util.ExportExcel;
import com.softcommerce.util.FormatObject;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author TOSHIBA
 */
public class UiPanelTFNotaSalida extends JHInternalFrame implements InterUiPanelTFNotaSalida, View, RowSelection, ControlView, ListSelectionListener, WindowListener, FocusListener, KeyListener, ActionListener, InternalFrameListener, MouseListener, PropertyChangeListener, ItemListener {

    private static final long serialVersionUID = 1L;
    public CTable table;
    public RecojoTableModel modeltable;
    public TableRowSorter<RecojoTableModel> modeloOrdenado;
    public JScrollPane scroll;
    private List<BeanEstadoDocumento> xestadoDocumento;
    private JComboBox cbo_idestado;
    private JTextField txt_despachoserie;
    private JTextField txt_despachopreimpreso;
    private JTextField txt_idmovimiento;
    private JTextField txt_tmpanexo;
    private JTextField txt_tmpruc;
    private JButton btn_buscar;
    private RegisterNotaSalida registeri;
    private JDesktopPane jdp;
    private Usuario usuario;
    private Main frame;
    private Date fechaInicio;
    private Date fechaFin;
    private JDateChooser dc_fechainicio;
    private JDateChooser dc_fechafin;
    private Gif gif;

    public UiPanelTFNotaSalida(String title, Main frame, JDesktopPane jdp, Usuario usuario) {
        super(title, true, false, false, true, false, true, true, true, true, true, true, true, true);
        this.usuario = usuario;
        this.frame = frame;
        this.jdp = jdp;
        inicialize();
    }

    public UiPanelTFNotaSalida(String title, Main frame, JDesktopPane jdp, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        this.jdp = jdp;
        inicialize();
    }

    private void inicialize() {
        modeltable = new RecojoTableModel();
        modeloOrdenado = new TableRowSorter<RecojoTableModel>(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        PopupMenuView popupmenu = new PopupMenuView();
        popupmenu.setControl(this);
        table.setComponentPopupMenu(popupmenu);
        table.getSelectionModel().addListSelectionListener(this);
        scroll = new JScrollPane(table);

        table.setNoVisibleColumn(7);
        table.setNoVisibleColumn(8);
        table.setNoVisibleColumn(9);

        table.addKeyListener(new KeyAdapter() {
            @Override
            public void keyReleased(KeyEvent e) {
                if (e.getKeyCode() == 127) {
                    //controlEliminate();
                } else {
                    e.getKeyCode();
                }
            }
        });

        table.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                    controlDetails();
                }
            }
        });

        JPanel pnlaux = new JPanel();
        pnlaux.setLayout(new BorderLayout(0, 0));

        JPanel panel = getPanelFilter();
        panel.setPreferredSize(new Dimension(1200, 100));
        pnlaux.add(panel, BorderLayout.CENTER);

        scroll.setPreferredSize(new Dimension(1200, 385));
        pnlaux.add(scroll, BorderLayout.SOUTH);

        setTable(pnlaux);
    }

    public JPanel getPanelFilter() {
        gif = new Gif();

        addKeyListener(this);

        JPanel pnlp = new JPanel();
        pnlp.setBorder(new LineBorder(new Color(130, 135, 144)));
        pnlp.setLayout(null);

        JLabel lblCodigoDespacho = new JLabel("Código");
        lblCodigoDespacho.setBounds(10, 25, 40, 20);
        lblCodigoDespacho.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lblCodigoDespacho);

        txt_idmovimiento = new JTextField();
        txt_idmovimiento.setBounds(50, 25, 90, 20);
        txt_idmovimiento.addKeyListener(this);
        txt_idmovimiento.addFocusListener(this);
        txt_idmovimiento.setFont(new Font("Garamond", 0, 14));
        pnlp.add(txt_idmovimiento);

        JLabel lblSerie = new JLabel("N° Despacho");
        lblSerie.setBounds(180, 25, 70, 20);
        pnlp.add(lblSerie);

        txt_despachoserie = new JTextField();
        txt_despachoserie.setBounds(250, 25, 30, 20);
        txt_despachoserie.addKeyListener(this);
        txt_despachoserie.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_despachoserie.addFocusListener(this);
        FormatObject.formatJTextFieldSerie(txt_despachoserie);
        txt_despachoserie.setForeground(Color.BLACK);
        pnlp.add(txt_despachoserie);

        txt_despachopreimpreso = new JTextField();
        txt_despachopreimpreso.setBounds(285, 25, 80, 20);
        txt_despachopreimpreso.addKeyListener(this);
        txt_despachopreimpreso.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_despachopreimpreso.addFocusListener(this);
        txt_despachopreimpreso.setDocument(new IntegerDocument(10));
        txt_despachopreimpreso.setForeground(Color.BLACK);
        pnlp.add(txt_despachopreimpreso);

        btn_buscar = new JButton("F5", gif.SEARCH16);
        btn_buscar.setBounds(375, 25, 70, 20);
        btn_buscar.setMnemonic('B');
        btn_buscar.setFont(new Font(Font.SANS_SERIF, 0, 9));
        btn_buscar.setOpaque(false);
        btn_buscar.setIconTextGap(10);
        btn_buscar.setToolTipText("Buscar");
        btn_buscar.setHorizontalAlignment(SwingConstants.LEFT);
        btn_buscar.setContentAreaFilled(true);
        btn_buscar.setBorderPainted(true);
        btn_buscar.setFocusable(true);
        btn_buscar.setFocusPainted(false);
        btn_buscar.addFocusListener(this);
        btn_buscar.addActionListener(this);
        btn_buscar.addKeyListener(this);
        btn_buscar.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        pnlp.add(this.btn_buscar);

        JLabel lbl_familia = new JLabel("Estado");
        lbl_familia.setFont(new Font("Verdana", 0, 11));
        lbl_familia.setBounds(490, 25, 50, 20);
        pnlp.add(lbl_familia);

        cbo_idestado = new JComboBox();
        cbo_idestado.setBounds(540, 25, 180, 20);
        cbo_idestado.addActionListener(this);
        cbo_idestado.addKeyListener(this);
        pnlp.add(cbo_idestado);

        JLabel lblFechaInicio = new JLabel("Fec Inicio");
        lblFechaInicio.setDisplayedMnemonic('c');
        lblFechaInicio.setBounds(585, 55, 50, 20);
        pnlp.add(lblFechaInicio);

        dc_fechainicio = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dc_fechainicio.setBounds(635, 55, 85, 20);
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
        pnlp.add(dc_fechainicio);

        JLabel lblFechaFin = new JLabel("Fec Fin");
        lblFechaFin.setBounds(730, 55, 40, 20);
        lblFechaFin.setDisplayedMnemonic('a');
        pnlp.add(lblFechaFin);

        dc_fechafin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dc_fechafin.setBounds(770, 55, 85, 20);
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
                dc_fechafin.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        pnlp.add(dc_fechafin);

        JLabel lblRazonSocial = new JLabel("R Social");
        lblRazonSocial.setBounds(10, 55, 40, 20);
        pnlp.add(lblRazonSocial);

        txt_tmpanexo = new JTextField();
        txt_tmpanexo.setBounds(50, 55, 350, 20);
        txt_tmpanexo.addKeyListener(this);
        txt_tmpanexo.setDocument(new UpperCaseNumberDocument(250));
        txt_tmpanexo.addFocusListener(this);
        pnlp.add(txt_tmpanexo);

        JLabel lbl_RucCliente = new JLabel("RUC/DNI");
        lbl_RucCliente.setBounds(425, 55, 50, 20);
        pnlp.add(lbl_RucCliente);

        txt_tmpruc = new JTextField();
        txt_tmpruc.setBounds(475, 55, 80, 20);
        txt_tmpruc.addFocusListener(this);
        txt_tmpruc.addKeyListener(this);
        pnlp.add(txt_tmpruc);

        return pnlp;
    }

    private String getParametro() {
        return "";
    }

    @Override
    public void controlReport(boolean export) {
        if (table.getRowCount() == 0) {
            return;
        }

        Map parameters = new HashMap();
        parameters.put(0, usuario.getDescriempresa());
        parameters.put(1, "Ruc: " + usuario.getRuc());
        parameters.put(2, "Nota Salida");
        ExportExcel.exportar(table, parameters);
    }

    public void filtrar() {
        modeloOrdenado.setRowFilter(getFilter());
        table.setAllColumnPreferredWidth();

        if (table.getRowCount() > 0) {
            table.setRowSelectionInterval(0, 0);
        }
    }

    public void setFecha(Date fechaInicio, Date fechaFin) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;

        dc_fechainicio.setSelectableDateRange(fechaInicio, fechaFin);
        dc_fechafin.setSelectableDateRange(fechaInicio, fechaFin);
        dc_fechainicio.setDate(fechaInicio);
        dc_fechafin.setDate(fechaFin);
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txt_idmovimiento)
                    || (e.getSource() == txt_tmpanexo)
                    || (e.getSource() == txt_tmpruc)
                    || (e.getSource() == txt_despachoserie)
                    || (e.getSource() == txt_despachopreimpreso)) {
                filtrar();
            }
        }
    }

    public RowFilter<Object, Object> getFilter() {
        List<RowFilter<Object, Object>> filters = new ArrayList<RowFilter<Object, Object>>();

        if (cbo_idestado.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xestadoDocumento.get(cbo_idestado.getSelectedIndex() - 1).getIdEstado() + ".*", 7));
        }

        if (txt_idmovimiento.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_idmovimiento.getText().trim() + ".*", 1));
        }

        if (txt_tmpruc.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_tmpruc.getText().trim() + ".*", 5));
        }

        if (txt_tmpanexo.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_tmpanexo.getText().trim() + ".*", 4));
        }

        if (txt_despachoserie.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_despachoserie.getText().trim() + ".*", 8));
        }

        if (txt_despachopreimpreso.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_despachopreimpreso.getText().trim() + ".*", 9));
        }

        if (!((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText().equals("__/__/____")
                && !((JTextFieldDateEditor) dc_fechafin.getDateEditor()).getText().equals("__/__/____")) {
            if (DateTime.isValidDate(((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText())
                    && DateTime.isValidDate(((JTextFieldDateEditor) dc_fechafin.getDateEditor()).getText())) {
                filters.add(RowFilter.dateFilter(ComparisonType.AFTER, DateTime.getDateMinusOrPlus(dc_fechainicio.getDate(), -1), 2));
                filters.add(RowFilter.dateFilter(ComparisonType.BEFORE, DateTime.getDateMinusOrPlus(dc_fechafin.getDate(), 1), 2));
            }
        }

        RowFilter<Object, Object> fooBarFilter = RowFilter.andFilter(filters);

        return fooBarFilter;
    }

    public void cargarFiltro() {
        loadEstadoDocumento();
    }

    public void loadEstadoDocumento() {
        RnEstadoDocumento regla_Familia = new RnEstadoDocumento(path);

        if (xestadoDocumento != null) {
            xestadoDocumento.clear();
        } else {
            xestadoDocumento = new ArrayList<BeanEstadoDocumento>();
        }

        xestadoDocumento.addAll(regla_Familia.listarGeneral());

        cbo_idestado.removeAllItems();
        cbo_idestado.addItem("--- TODOS ---");

        for (Integer i = 0; i < xestadoDocumento.size(); i++) {
            cbo_idestado.addItem(xestadoDocumento.get(i).getDescripcion());
        }

        cbo_idestado.setSelectedIndex(0);
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_idmovimiento) {
            txt_idmovimiento.selectAll();
        }

        if (e.getSource() == txt_tmpanexo) {
            txt_tmpanexo.selectAll();
        }

        if (e.getSource() == txt_tmpruc) {
            txt_tmpruc.selectAll();
        }

        if (e.getSource() == txt_despachoserie) {
            txt_despachoserie.selectAll();
        }

        if (e.getSource() == txt_despachopreimpreso) {
            txt_despachopreimpreso.selectAll();
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == btn_buscar) {
            BuscarSalidasEntradas b = new BuscarSalidasEntradas(frame, this, usuario, path);
            b.mostrar();
        }

        if (e.getSource() == dc_fechainicio.getCalendarButton()) {
            dc_fechainicio.setSelectableDateRange(fechaInicio, dc_fechafin.getDate());
        }

        if (e.getSource() == dc_fechafin.getCalendarButton()) {
            dc_fechafin.setSelectableDateRange(dc_fechainicio.getDate(), fechaFin);
        }

        if (e.getSource() == cbo_idestado) {
            if (cbo_idestado.getItemCount() > 0) {
                if (cbo_idestado.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }
    }

    @Override
    public void controlPrint(boolean view) {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        try {
            Reporte reportFast = new Reporte(path);
            reportFast.generarReporte("Despacho", getSelectedValue(1), "", "", "", "", "", view, false,
                    "Reporte Notas de Salida");
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, ex.toString());
        }
    }

    @Override
    public void controlAdd() {
        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        if (registeri == null) {
            registeri = new RegisterNotaSalida("Detalle de Nota de Salida", usuario, frame);
            registeri.setPath(path);
            registeri.setRowSelection(this);
            registeri.setView(this);
            registeri.setFecha(fechaInicio, fechaFin);
            registeri.setModeRegister(Register.INSERT);
            registeri.addInternalFrameListener(this);
            jdp.updateUI();
            jdp.add(registeri);
            registeri.setVisible(true);
            jdp.updateUI();
            registeri.selectInternalFrame();
        } else {
            registeri.selectInternalFrame();
        }

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlModify() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        if (registeri == null) {
            registeri = new RegisterNotaSalida("Detalle de Nota de Salida", usuario, frame);
            registeri.setPath(path);
            registeri.setRowSelection(this);
            registeri.setView(this);
            registeri.setFecha(fechaInicio, fechaFin);
            registeri.setModeRegister(Register.UPDATE);
            registeri.addInternalFrameListener(this);
            jdp.updateUI();
            jdp.add(registeri);
            registeri.setVisible(true);
            jdp.updateUI();
            registeri.selectInternalFrame();
        } else {
            registeri.selectInternalFrame();
        }

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlNullify() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        int visibleRowIndex = table.getSelectedRow();
        int realRowIndex = table.convertRowIndexToModel(visibleRowIndex);

        RnRegContaCab regla_1 = new RnRegContaCab(path);
        String id_estado = regla_1.getIdestadoMovimiento(modeltable.getRecojo(realRowIndex).getIdMovimiento());

        RnEstadoDocumento regla_2 = new RnEstadoDocumento(path);
        String descripcion = regla_2.getDescripcion(id_estado);

        if (id_estado.trim().equals("001")) {
            JOptionPane.showMessageDialog(frame, "La Nota de Salida ya esta " + descripcion.substring(0, 1).toUpperCase() + descripcion.substring(1, descripcion.length()).toLowerCase() + ". ", "Anular Nota de Salida", JOptionPane.INFORMATION_MESSAGE);
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        if (registeri == null) {
            registeri = new RegisterNotaSalida("Detalle de Nota de Salida", usuario, frame);
            registeri.setPath(path);
            registeri.setRowSelection(this);
            registeri.setView(this);
            registeri.setFecha(fechaInicio, fechaFin);
            registeri.setModeRegister(Register.ANULAR);
            registeri.addInternalFrameListener(this);
            jdp.updateUI();
            jdp.add(registeri);
            registeri.setVisible(true);
            jdp.updateUI();
            registeri.selectInternalFrame();
        } else {
            registeri.selectInternalFrame();
        }

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlEliminate() {
        try {
            if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
                return;
            }

            int visibleRowIndex = table.getSelectedRow();
            int realRowIndex = table.convertRowIndexToModel(visibleRowIndex);

            RnMovInventarioCab logic = new RnMovInventarioCab(path);
            String id_movimiento = modeltable.getRecojo(realRowIndex).getIdMovimiento();
            String id_estado = modeltable.getRecojo(realRowIndex).getIdEstado();
            RnEstadoDocumento logicEstado = new RnEstadoDocumento(path);
            String descripcion = logicEstado.getDescripcion(id_estado);

            if (!id_estado.trim().equals("001")) {
                JOptionPane.showMessageDialog(frame, "El documento esta en estado " + descripcion.substring(0, 1).toUpperCase() + descripcion.substring(1, descripcion.length()).toLowerCase() + ". "
                        + "\n Para que el documento pueda ser eliminado debe estar en estado Anulado.", "Eliminar Documento", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            int xres;
            xres = JOptionPane.showConfirmDialog(this,
                    "Seguro que desea eliminar el documento", "Sistema",
                    JOptionPane.OK_CANCEL_OPTION, JOptionPane.QUESTION_MESSAGE);
            if (xres == JOptionPane.OK_OPTION) {
                logic.eliminarMic(id_movimiento);
                JOptionPane.showMessageDialog(this, "Documento eliminado correctamente");
                cargarTabla();
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void controlDetails() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        if (registeri == null) {
            registeri = new RegisterNotaSalida("Detalle de Nota de Salida", usuario, frame);
            registeri.setPath(path);
            registeri.setRowSelection(this);
            registeri.setView(this);
            registeri.setFecha(fechaInicio, fechaFin);
            registeri.setModeRegister(Register.DETAIL);
            registeri.addInternalFrameListener(this);
            jdp.updateUI();
            jdp.add(registeri);
            registeri.setVisible(true);
            jdp.updateUI();
            registeri.selectInternalFrame();
        } else {
            registeri.selectInternalFrame();
        }

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlClone() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlClose() {
        dispose();
        doDefaultCloseAction();

        if (registeri != null) {
            registeri.dispose();
            registeri.doDefaultCloseAction();
        }
    }

    @Override
    public void controlRefresh() {
        cargarTabla();
    }

    @Override
    public Object getSelectedValue(int column) {
        int visibleRowIndex = table.getSelectedRow();
        int realRowIndex = table.convertRowIndexToModel(visibleRowIndex);

        return modeltable.getValueAt(realRowIndex, column);
    }

    @Override
    public void setSelectedRow(int row) {
        if (row >= 0) {
            table.setRowSelectionInterval(row, row);
            setScrollValueView(row);
        }
    }

    @Override
    public void valueChanged(ListSelectionEvent e) {
        if (!e.getValueIsAdjusting()) {
            refresh();
        }
    }

    @Override
    public int getSelectedRow() {
        return table.getSelectedRow();
    }

    @Override
    public void selectNextRow() {
        if (table.getRowCount() > 0) {
            if (table.getSelectedRow() < table.getRowCount() - 1) {
                int row = table.getSelectedRow() + 1;
                table.setRowSelectionInterval(row, row);
                setScrollValueView(row);
            }
        }
    }

    @Override
    public void selectPreviusRow() {
        if (table.getRowCount() > 0) {
            if (table.getSelectedRow() > 0) {
                int row = table.getSelectedRow() - 1;
                table.setRowSelectionInterval(row, row);
                setScrollValueView(row);
            }
        }
    }

    @Override
    public void selectLastRow() {
        if (table.getRowCount() > 0) {
            int rowCount = table.getRowCount() - 1;
            table.setRowSelectionInterval(rowCount, rowCount);
            setScrollValueView(rowCount);
        }
    }

    @Override
    public void selectFirstRow() {
        if (table.getRowCount() > 0) {
            table.setRowSelectionInterval(0, 0);
            setScrollValueView(0);
        }
    }

    public void setScrollValueView(int row) {
        scroll.getVerticalScrollBar().setValue(table.getRowHeight() * row);
    }

    @Override
    public int getRowCount() {
        return table.getRowCount();
    }

    public void cargarTabla() {
        RnRegContaCab regla = new RnRegContaCab(path);
        modeloOrdenado.setRowFilter(null);
        modeltable.clearTable();
        ContaCab m = new ContaCab();
        m.setIdTipoDoc("OS");
        m.setIdTipoMov("014");
        m.setTipo("S");
        m.setIdEmpresa(usuario.getCodempresa());
        m.setIdPuntoventa(usuario.getCodpuntoventa());
        m.setFInicial(fechaInicio);
        m.setFFinal(fechaFin);
        modeltable.agregarVectorrecojo(regla.listarOrdenRecojo(m));
        modeloOrdenado.setRowFilter(getFilter());
        table.setAllColumnPreferredWidth();
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_idmovimiento && txt_idmovimiento.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_idmovimiento.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txt_idmovimiento.setText(nuevaserie);

            filtrar();
        }

        if (e.getSource() == txt_despachoserie && txt_despachoserie.getText().trim().length() > 0) {
            String serie = "000" + txt_despachoserie.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 3, serie.length());

            txt_despachoserie.setText(nuevaserie);

            filtrar();
        }

        if (e.getSource() == txt_despachopreimpreso && txt_despachopreimpreso.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_despachopreimpreso.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txt_despachopreimpreso.setText(nuevaserie);

            filtrar();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txt_idmovimiento) {
                txt_despachoserie.requestFocus();
            }

            if (e.getSource() == txt_despachoserie) {
                txt_despachopreimpreso.requestFocus();
            }

            if (e.getSource() == txt_despachopreimpreso) {
                cbo_idestado.requestFocus();
            }

            if (e.getSource() == cbo_idestado) {
                txt_tmpanexo.requestFocus();
            }

            if (e.getSource() == txt_tmpanexo) {
                txt_tmpruc.requestFocus();
            }

            if (e.getSource() == txt_tmpruc) {
                ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).requestFocus();
            }
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
    public void internalFrameClosing(InternalFrameEvent e) {
        jdp.updateUI();

        if (registeri == e.getSource()) {
            registeri.dispose();
            registeri = null;
        }

        jdp.updateUI();

        System.gc();
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void refreshTitleName() {
    }

    @Override
    public void setSelectedRow(String clave, int column) {
    }

    @Override
    public Object getSelectedValue(String column) {
        return null;
    }

    @Override
    public void controlSearch() {
    }

    @Override
    public void windowOpened(WindowEvent e) {
    }

    @Override
    public void windowClosing(WindowEvent e) {
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
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void selectFirstPage() {
    }

    @Override
    public void selectPreviusPage() {
    }

    @Override
    public void selectNextPage() {
    }

    @Override
    public void selectLastPage() {
    }

    @Override
    public int getSelectedPage() {
        return 0;
    }

    @Override
    public int getPageCount() {
        return 0;
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

    @Override
    public void itemStateChanged(ItemEvent e) {
    }
}
