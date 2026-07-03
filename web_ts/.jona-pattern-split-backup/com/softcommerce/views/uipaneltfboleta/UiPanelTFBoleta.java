package com.softcommerce.views.uipaneltfboleta;


import com.softcommerce.formularios.*;
import com.softcommerce.reportes.jheyson.RptVenta;
import com.softcommerce.beans.BeanEstadoDocumento;
import com.softcommerce.beans.BeanParametro;
import com.softcommerce.beans.BeanRegcontaAdicional;
import com.softcommerce.beans.BeanRegcontaCab;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.tablas.TableModelPanelTFBoleta;
import com.softcommerce.gui.FormVentaItemReport;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnEstadoDocumento;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.report.ConvertNumberToLetter;
import com.softcommerce.util.ExportExcel;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JDesktopPane;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.RowFilter;
import javax.swing.RowFilter.ComparisonType;
import javax.swing.SwingConstants;
import javax.swing.event.InternalFrameEvent;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.table.TableRowSorter;
import net.sf.jasperreports.engine.JRParameter;
import com.softcommerce.util.Exportar;
import com.softcommerce.datasource.DataSourceVenta;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.beans.BeanRegcontaItem;
import com.softcommerce.enums.AuxiliarEnum;
import com.softcommerce.enums.CondicionPagoEnum;
import com.softcommerce.enums.EstadoDocumentoEnum;
import com.softcommerce.enums.MonedaEnum;
import com.softcommerce.enums.TipoDocVentaEnum;
import com.softcommerce.enums.TipoVentaEnum;
import com.softcommerce.general.controles.PopupMenuVenta;
import com.softcommerce.reglasnegocio.RnParametro;
import com.softcommerce.reglasnegocio.RnRegconta;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.FEtxt;
import com.softcommerce.util.FactElectTxt;
import com.softcommerce.util.FormatObject;
import com.softcommerce.util.LayoutUtil;
import com.softcommerce.util.Util;
import com.softcommerce.util.UtilCenter;
import com.softcommerce.util.editor.CellEditorBtnFactElect;
import com.softcommerce.views.uilogin.UiLoginImpl;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import org.apache.log4j.Logger;

public class UiPanelTFBoleta
        extends JHInternalFrame
        implements InterUiPanelTFBoleta, ListSelectionListener, FocusListener, KeyListener, ActionListener,
        PropertyChangeListener, ItemListener {

    public CTable table;
    public TableModelPanelTFBoleta modeltable;
    public TableRowSorter<TableModelPanelTFBoleta> modeloOrdenado;
    public JScrollPane scroll;
    private JComboBox cboEstado;
    private List<BeanEstadoDocumento> xestadoDocumento;
    private JComboBox cboTipoDoc;
    private JTextField txtSerie;
    private JTextField txtPreimpreso;
    private JTextField txtNumero;
    private JTextField txtCliente;
    private JComboBox cboCondicionPago;
    private final Usuario usuario;
    private final JDesktopPane jdp;
    private final JFrame frame;
    private RegisterBoleta registeri;
    private Date fechaInicio;
    private Date fechaFin;
    private JDateChooser dcFechaInicio;
    private JDateChooser dcFechaFin;
    private JCheckBox chkImpresionQr;
    private final JLabel lblLocalidad = new JLabel("Localidad");
    private final JLabel lblPuntoVenta = new JLabel("P Venta");
    private JComboBox cboLocalidad;
    private JComboBox cboPuntoVenta;
    private Gif gif;
    private final Logger logger = Logger.getLogger(UiPanelTFBoleta.class);
    private CellEditorBtnFactElect cellEditorFE;

    public UiPanelTFBoleta(String title, JFrame frame, JDesktopPane jdp, Usuario usuario) {
        super(title + " - UiPanelTFBoleta");
        this.usuario = usuario;
        this.frame = frame;
        this.jdp = jdp;
        inicialize();
    }

    public UiPanelTFBoleta(String title, JFrame frame, JDesktopPane jdp, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        this.jdp = jdp;
        inicialize();
    }

    public UiPanelTFBoleta(String title, JFrame frame, JDesktopPane jdp, Usuario usuario, boolean vendedor) {
        super(title + " - UiPanelTFBoleta", true, false, false, true, false, true, true, true, true, true, true, true, true);
        this.usuario = usuario;
        this.frame = frame;
        this.jdp = jdp;
        inicialize();
    }

    private void inicialize() {
        gif = new Gif();
        super.getPnlControl().getCbSearch().setText("Ventas X Item");
        super.getPnlControl().getCbSearch().setIcon(gif.ventasPorItem);
        if (!Constans.ISIMPRESIONVENTA) {
            super.getPnlControl().getCbPrintFast().setText("Exportar Txt");
            super.getPnlControl().getCbPrintFast().setIcon(gif.NEW16);
        }
        modeltable = new TableModelPanelTFBoleta();
        modeloOrdenado = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        if (Constans.IS_FACTURADOR_SUNAT) {
            table.setColumnEditable(0);
        }
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        PopupMenuVenta popupmenu = new PopupMenuVenta();
        popupmenu.setPnlBoleta(this);
        table.setComponentPopupMenu(popupmenu);
        table.getSelectionModel().addListSelectionListener(this);
        scroll = new JScrollPane(table);

        table.setNoVisibleColumn(2);
        table.setNoVisibleColumn(3);
        table.setNoVisibleColumn(4);
        table.setNoVisibleColumn(5);
        table.setNoVisibleColumn(6);
        table.setNoVisibleColumn(7);
        table.setNoVisibleColumn(8);
        table.setNoVisibleColumn(9);
        table.setNoVisibleColumn(10);
        table.setNoVisibleColumn(11);
        table.setNoVisibleColumn(12);
        table.setNoVisibleColumn(13);
        table.setNoVisibleColumn(14);
        table.setNoVisibleColumn(15);
        table.setNoVisibleColumn(17);
        table.setNoVisibleColumn(20);
        table.setNoVisibleColumn(21);
        table.setNoVisibleColumn(22);
        table.setNoVisibleColumn(23);
        table.setNoVisibleColumn(24);
        table.setNoVisibleColumn(25);
        table.setNoVisibleColumn(26);
        table.setNoVisibleColumn(27);
        table.setNoVisibleColumn(28);
        table.setNoVisibleColumn(30);
        table.setNoVisibleColumn(32);
        table.setNoVisibleColumn(33);
        table.setNoVisibleColumn(34);
        table.setNoVisibleColumn(35);
        table.setNoVisibleColumn(36);
        table.setNoVisibleColumn(38);
        table.setNoVisibleColumn(39);
        table.setNoVisibleColumn(40);
        table.setNoVisibleColumn(41);
        table.setNoVisibleColumn(42);
        table.setNoVisibleColumn(43);
        table.setNoVisibleColumn(44);
        table.setNoVisibleColumn(45);
        table.setNoVisibleColumn(46);
        table.setNoVisibleColumn(47);
        table.setNoVisibleColumn(48);
        table.setNoVisibleColumn(49);
        table.setNoVisibleColumn(50);
        table.setNoVisibleColumn(51);
        table.setNoVisibleColumn(52);
        table.setNoVisibleColumn(53);
        table.setNoVisibleColumn(54);
        table.setNoVisibleColumn(55);
        table.setNoVisibleColumn(57);
        table.setNoVisibleColumn(58);
        table.setNoVisibleColumn(59);
        table.setNoVisibleColumn(60);
        table.setNoVisibleColumn(61);
        table.setNoVisibleColumn(62);
        table.setNoVisibleColumn(64);
        table.setNoVisibleColumn(65);
        table.setNoVisibleColumn(66);
        table.setNoVisibleColumn(67);
        table.setNoVisibleColumn(69);
        table.setNoVisibleColumn(71);
        table.setNoVisibleColumn(72);
        table.setNoVisibleColumn(73);
        table.setNoVisibleColumn(74);
        table.setNoVisibleColumn(75);
        table.setNoVisibleColumn(76);
        table.setNoVisibleColumn(80);
        table.setNoVisibleColumn(82);
        table.moveColumn(7, 2);
        table.moveColumn(9, 3);
        table.moveColumn(11, 6);
        table.moveColumn(12, 10);
        table.moveColumn(13, 12);

        table.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                    controlDetails();
                }
            }
        });

        JPanel pnlaux = new JPanel();
        pnlaux.setLayout(new BorderLayout());

        JPanel panel = getPanelFilter();
        pnlaux.add(panel, BorderLayout.NORTH);
        pnlaux.add(scroll, BorderLayout.CENTER);

        setTable(pnlaux);

        table.setColumnMinWidth(4, 270);
        table.setColumnMaxWidth(4, 270);

    }

    public JPanel getPanelFilter() {
        JPanel pnlPrinc = new JPanel();
        GridBagConstraints gbc = LayoutUtil.getGbc();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnlp = new JPanel();
        pnlp.setLayout(new GridBagLayout());
        pnlPrinc.add(pnlp, BorderLayout.WEST);

        JLabel lblTipoDocumento = new JLabel("Documento");
        pnlp.add(lblTipoDocumento, gbc);

        cboTipoDoc = new JComboBox();
        gbc.gridx = 1;
        pnlp.add(cboTipoDoc, gbc);
        cboTipoDoc.addItemListener(this);
        cboTipoDoc.addKeyListener(this);

        txtSerie = new JTextField();
        gbc.gridx = 2;
        pnlp.add(txtSerie, gbc);
        txtSerie.setColumns(3);
        txtSerie.addKeyListener(this);
        txtSerie.addFocusListener(this);
        FormatObject.formatJTextFieldSerie(txtSerie);
        txtSerie.setForeground(Color.BLACK);

        txtPreimpreso = new JTextField();
        gbc.gridx = 3;
        gbc.gridwidth = 2;
        pnlp.add(txtPreimpreso, gbc);
        gbc.gridwidth = 1;
        txtPreimpreso.setColumns(8);
        txtPreimpreso.addKeyListener(this);
        txtPreimpreso.addFocusListener(this);
        txtPreimpreso.setDocument(new IntegerDocument(10));
        txtPreimpreso.setForeground(Color.BLACK);

        JLabel lbl_condpago = new JLabel("C Pago");
        gbc.gridx = 5;
        pnlp.add(lbl_condpago, gbc);

        cboCondicionPago = new JComboBox();
        gbc.gridx = 6;
        pnlp.add(cboCondicionPago, gbc);
        cboCondicionPago.addKeyListener(this);
        cboCondicionPago.addItemListener(this);

        gbc.gridx = 7;
        JLabel lblEstado = new JLabel("Est");
        pnlp.add(lblEstado, gbc);

        gbc.gridx = 8;
        cboEstado = new JComboBox();
        pnlp.add(cboEstado, gbc);
        cboEstado.addItemListener(this);

        gbc.gridx = 9;
        pnlp.add(lblLocalidad, gbc);

        cboLocalidad = new JComboBox();
        gbc.gridx = 10;
        pnlp.add(cboLocalidad, gbc);

        JLabel lblRazonSocial = new JLabel("R Social");
        gbc.gridx = 0;
        gbc.gridy = 1;
        pnlp.add(lblRazonSocial, gbc);

        txtCliente = new JTextField();
        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.gridwidth = 6;
        pnlp.add(txtCliente, gbc);
        txtCliente.addKeyListener(this);
        txtCliente.setDocument(new UpperCaseNumberDocument(255));
        txtCliente.addFocusListener(this);
        gbc.gridwidth = 1;

        JLabel lbl_RucCliente = new JLabel("RUC/DNI");
        gbc.gridx = 7;
        pnlp.add(lbl_RucCliente, gbc);

        txtNumero = new JTextField();
        gbc.gridx = 8;
        pnlp.add(txtNumero, gbc);
        txtNumero.setColumns(7);
        txtNumero.addFocusListener(this);
        txtNumero.setDocument(new IntegerDocument(11));
        txtNumero.addKeyListener(this);

        gbc.gridx = 9;
        pnlp.add(lblPuntoVenta, gbc);
        cboPuntoVenta = new JComboBox();
        gbc.gridx = 10;
        pnlp.add(cboPuntoVenta, gbc);

        JLabel lblFechaInicio = new JLabel("F Inicio");
        lblFechaInicio.setDisplayedMnemonic('c');
        gbc.gridx = 0;
        gbc.gridy = 2;
        pnlp.add(lblFechaInicio, gbc);

        dcFechaInicio = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dcFechaInicio.getJCalendar().addFocusListener(this);
        dcFechaInicio.getJCalendar().addKeyListener(this);
        dcFechaInicio.getCalendarButton().addActionListener(this);
        dcFechaInicio.addPropertyChangeListener(this);
        dcFechaInicio.addKeyListener(this);
        dcFechaInicio.addFocusListener(this);
        ((JTextField) dcFechaInicio.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                ((JTextFieldDateEditor) dcFechaFin.getDateEditor()).requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dcFechaInicio.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dcFechaInicio.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        gbc.gridx = 1;
        gbc.gridwidth = 2;
        pnlp.add(dcFechaInicio, gbc);
        gbc.gridwidth = 1;

        JLabel lblFechaFin = new JLabel("F Fin");
        lblFechaFin.setDisplayedMnemonic('a');
        gbc.gridx = 3;
        pnlp.add(lblFechaFin, gbc);

        dcFechaFin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dcFechaFin.getJCalendar().addFocusListener(this);
        dcFechaFin.getJCalendar().addKeyListener(this);
        dcFechaFin.getCalendarButton().addActionListener(this);
        dcFechaFin.addPropertyChangeListener(this);
        dcFechaFin.addKeyListener(this);
        dcFechaFin.addFocusListener(this);
        ((JTextField) dcFechaFin.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dcFechaFin.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dcFechaFin.getDateEditor()).setColumns(12);
        gbc.gridx = 4;
        gbc.gridwidth = 2;
        pnlp.add(dcFechaFin, gbc);
        gbc.gridwidth = 1;

        chkImpresionQr = new JCheckBox("Codigo QR");
        chkImpresionQr.setFont(new Font("Verdana", 1, 10));
        chkImpresionQr.setHorizontalTextPosition(SwingConstants.RIGHT);

        gbc.gridx = 6;
        if (Constans.IS_FACTURADOR_SUNAT) {
            chkImpresionQr.setSelected(true);
            pnlp.add(chkImpresionQr, gbc);
        }

        cboLocalidad.addItemListener(this);
        cboPuntoVenta.addItemListener(this);
        return pnlPrinc;
    }

    public void changeCondicionPago() {
        try {
            System.out.println("changeCondicionPago()");
            if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
                return;
            }

            int visibleRowIndex = table.getSelectedRow();
            int realRowIndex = table.convertRowIndexToModel(visibleRowIndex);
            ContaCab contaCab = modeltable.getRegContaCab(realRowIndex);
            String idEstado = contaCab.getIdEstado();
            if (idEstado.equals("001")) {
                JOptionPane.showMessageDialog(this, "No se puede cambiar condicion de Pago\nDocumento ya se encuentra cancelado");
                return;
            }
            Date fEmision = contaCab.getFEmision();
            RnRegconta logic = new RnRegconta(path);
            String idAuxiliar = contaCab.getIdAuxiliar();
            String rpta = logic.estadoPeriodoAuxiliar(Util.getIdPeriodoMensual(fEmision), idAuxiliar);
            if (rpta.trim().substring(0, 1).equals("*")) {
                JOptionPane.showMessageDialog(this, rpta);
                return;
            }
            String idRegconta = contaCab.getRcIdregconta();
            String idCondicionPago = contaCab.getIdCondicionVenta();
            CondicionPagoEnum cpEnumOld = this.getCondicionPagoEnum(idCondicionPago);
            CondicionPagoEnum cpEnumNew = this.getCondicionPagoEnumNew(cpEnumOld);
            int xres = JOptionPane.showConfirmDialog(this,
                    "Desea actualizar la condicion de pago a: " + cpEnumNew.name(),
                    "Actualizar Condicion Pago", JOptionPane.OK_CANCEL_OPTION);
            if (xres != JOptionPane.OK_OPTION) {
                return;
            }
            rpta = logic.updateCondicionPagoVenta(idRegconta, cpEnumNew.getValue());
            JOptionPane.showMessageDialog(this, rpta);
            if (!rpta.trim().substring(0, 1).equals("*")) {
                this.cargarTabla();
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private CondicionPagoEnum getCondicionPagoEnumNew(CondicionPagoEnum cpEnumOld) {
        if (cpEnumOld.equals(CondicionPagoEnum.CONTADO)) {
            return CondicionPagoEnum.CREDITO;
        }
        return CondicionPagoEnum.CONTADO;
    }

    private CondicionPagoEnum getCondicionPagoEnum(String idCondicionPago) {
        try {
            return CondicionPagoEnum.get(idCondicionPago);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            return CondicionPagoEnum.CREDITO;
        }
    }

    @Override
    public void controlReport(boolean export) {
        if (table.getRowCount() == 0) {
            return;
        }

        Map parameters = new HashMap();
        parameters.put(0, usuario.getDescriempresa());
        parameters.put(1, "Ruc: " + usuario.getRuc());
        parameters.put(2, "Boleta");
        ExportExcel.exportar(table, parameters);
    }

    public void filtrar() {
        modeloOrdenado.setRowFilter(getFilter());
        table.setAllColumnPreferredWidth();

        if (table.getRowCount() > 0) {
            table.setRowSelectionInterval(0, 0);
        }
    }

    @Override
    public void setFecha(Date fechaInicio, Date fechaFin) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;

        dcFechaInicio.setSelectableDateRange(fechaInicio, fechaFin);
        dcFechaFin.setSelectableDateRange(fechaInicio, fechaFin);
        dcFechaInicio.setDate(fechaInicio);
        dcFechaFin.setDate(fechaFin);
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txtCliente)
                    || (e.getSource() == txtNumero)
                    || (e.getSource() == txtSerie)
                    || (e.getSource() == txtPreimpreso)) {
                filtrar();
            }
        }
    }

    public RowFilter<Object, Object> getFilter() {
        List<RowFilter<Object, Object>> filters = new ArrayList();

        if (cboEstado.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xestadoDocumento.get(cboEstado.getSelectedIndex() - 1).getIdEstado() + ".*", 55));
        }

        if (cboTipoDoc.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + (cboTipoDoc.getSelectedItem().toString().trim().equals("F") ? "01"
                    : cboTipoDoc.getSelectedItem().toString().trim().equals("B") ? "03"
                    : cboTipoDoc.getSelectedItem().toString().trim().equals("NC") ? "07" : "08") + ".*", 13));
        }

        if (cboLocalidad.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter((cboLocalidad.getSelectedItem().toString().trim().equals("TODOS") ? ".*" : "^" + cboLocalidad.getSelectedItem().toString().trim()), 79));
        }

        if (cboPuntoVenta.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter((cboPuntoVenta.getSelectedItem().toString().trim().equals("TODOS") ? ".*" : "^" + cboPuntoVenta.getSelectedItem().toString().trim()), 68));
        }

        if (cboCondicionPago.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + (cboCondicionPago.getSelectedIndex() == 1 ? "CO" : "CR") + ".*", 56));
        }

        if (txtCliente.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtCliente.getText().trim() + ".*", 57));
        }

        if (txtNumero.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtNumero.getText().trim() + ".*", 18));
        }
        if (!((JTextFieldDateEditor) dcFechaInicio.getDateEditor()).getText().equals("__/__/____")
                && !((JTextFieldDateEditor) dcFechaFin.getDateEditor()).getText().equals("__/__/____")) {
            if (DateTime.isValidDate(((JTextFieldDateEditor) dcFechaInicio.getDateEditor()).getText())
                    && DateTime.isValidDate(((JTextFieldDateEditor) dcFechaFin.getDateEditor()).getText())) {
                filters.add(RowFilter.dateFilter(ComparisonType.AFTER, DateTime.getDateMinusOrPlus(dcFechaInicio.getDate(), -1), 37));
                filters.add(RowFilter.dateFilter(ComparisonType.BEFORE, DateTime.getDateMinusOrPlus(dcFechaFin.getDate(), 1), 37));
            }
        }

        if (txtSerie.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtSerie.getText().trim() + ".*", 14));
        }

        if (txtPreimpreso.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtPreimpreso.getText().trim() + ".*", 15));
        }

        RowFilter<Object, Object> fooBarFilter = RowFilter.andFilter(filters);

        return fooBarFilter;
    }

    @Override
    public void cargarFiltro() {
        loadEstadoDocumento();
        loadTipoDocumento();
        loadCondPago();
        loadLocalidadCombo();
        lblLocalidad.setVisible(true);
        cboLocalidad.setVisible(true);
        lblPuntoVenta.setVisible(true);
        cboPuntoVenta.setVisible(true);
    }

    private void loadLocalidadCombo() {
        //List<Usuario> listaUsuario = SessionSystem.usuariosConAcceso;
        List<Usuario> listaUsuario = UiLoginImpl.usuariosConAcceso;
        Iterator<Usuario> iterador = listaUsuario.iterator();
        HashSet<String> localidades = new HashSet();
        while (iterador.hasNext()) {
            localidades.add(iterador.next().getDescrilocalidad());
        }
        Iterator<String> i = localidades.iterator();
        cboLocalidad.addItem("TODOS");
        while (i.hasNext()) {
            cboLocalidad.addItem(i.next());
        }

    }

    public void loadCondPago() {
        cboCondicionPago.addItem("T");
        cboCondicionPago.addItem("CO");
        cboCondicionPago.addItem("CR");
        cboCondicionPago.setSelectedIndex(0);
    }

    public void loadTipoDocumento() {
        cboTipoDoc.addItem("T");
        cboTipoDoc.addItem("F");
        cboTipoDoc.addItem("B");
        cboTipoDoc.addItem("NC");
        cboTipoDoc.addItem("ND");
        cboTipoDoc.setSelectedIndex(0);
    }

    public void loadEstadoDocumento() {
        RnEstadoDocumento regla_Familia = new RnEstadoDocumento(path);

        if (xestadoDocumento != null) {
            xestadoDocumento.clear();
        } else {
            xestadoDocumento = new ArrayList();
        }

        xestadoDocumento.addAll(regla_Familia.listarGeneral());

        cboEstado.removeAllItems();
        cboEstado.addItem("T");

        for (Integer i = 0; i < xestadoDocumento.size(); i++) {
            cboEstado.addItem(xestadoDocumento.get(i).getAbreviatura());
        }

        cboEstado.setSelectedIndex(0);
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() instanceof JTextField) {
            ((JTextField) e.getSource()).selectAll();
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {

        if (e.getSource() == dcFechaInicio.getCalendarButton()) {
            dcFechaInicio.setSelectableDateRange(fechaInicio, dcFechaFin.getDate());
        }

        if (e.getSource() == dcFechaFin.getCalendarButton()) {
            dcFechaFin.setSelectableDateRange(dcFechaInicio.getDate(), fechaFin);
        }
    }

    private void exportarTxt(ContaCab beanRcc) throws Exception {
        try {
            if (Util.isVentaCosto()) {
                (new FactElectTxt(this.path, beanRcc.getRcIdregconta(), beanRcc.getIdTipoDoc(), this.usuario)).exportTxt();
                return;
            }
            FEtxt feTxt = new FEtxt(path, this.getNameFile(beanRcc.getIdTipoDoc(), beanRcc));
            feTxt.exportarTxt(beanRcc.getIdTipoDoc(), beanRcc.getSerie(), beanRcc.getPreimpreso());
        } catch (Exception e) {
            throw e;
        }
    }

    private String getNameFile(String idTipoDoc, ContaCab beanRcc) {
        return this.usuario.getRuc() + "-" + idTipoDoc + "-" + beanRcc.getSerie() + "-" + beanRcc.getPreimpreso8Digs();
    }

    @Override
    public void controlPrint(boolean view) {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }
        try {
            ContaCab beanRcc = modeltable.getRegContaCab(table.convertRowIndexToModel(table.getSelectedRow()));
            if (beanRcc.getLineaImpresion() == 0) {
                JOptionPane.showMessageDialog(null, "No se puede imprimir");
                return;
            }
            String idRegconta = beanRcc.getRcIdregconta();
            String idTipoDoc = beanRcc.getIdTipoDoc();
            if (!Constans.ISIMPRESIONVENTA && !view) {
                this.exportarTxt(beanRcc);
                return;
            }
            if (Util.isImpresionContinua(idTipoDoc)) {
                this.impresionContinua(idRegconta, idTipoDoc);
            } else {
                this.impresion(beanRcc, idRegconta, idTipoDoc, view);
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    private void impresion(ContaCab beanRcc, String idRegconta, String idTipoDoc, boolean view)
            throws Exception {
        try {
            if (Constans.TIPO_VENTA.compareTo(TipoVentaEnum.COSTO.getValue()) == 0) {
                this.impresionVentaCosto(idRegconta, idTipoDoc);
            } else {
                this.impresionNormal(beanRcc, idRegconta, idTipoDoc, view);
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void impresionContinua(String idRegconta, String idTipoDoc) {
        int maxProd = 0;
        if (idTipoDoc.equals(TipoDocVentaEnum.BOLETA.getValue())) {
            maxProd = Integer.parseInt(getParametroSistema("00122"));
        }
        if (idTipoDoc.equals(TipoDocVentaEnum.FACTURA.getValue())) {
            maxProd = Integer.parseInt(getParametroSistema("00121"));
        }
        if (maxProd == 0) {
            JOptionPane.showMessageDialog(null, "Configurar maximo de productos Boleta/Factura");
            return;
        }
        RptVenta rptVenta = new RptVenta(this.path, this.usuario);
        rptVenta.createReport(idRegconta, idTipoDoc, maxProd, null);
    }

    private void impresionNormal(ContaCab beanRcc, String idRegconta, String idTipoDoc, boolean view)
            throws Exception {
        try {
            String rutaJasper = Util.getRutaJasperFE(idTipoDoc,
                    beanRcc.getSerie());
            logger.info("rutaJasper: " + rutaJasper);
            Map parameters = new HashMap();
            ConvertNumberToLetter conv = new ConvertNumberToLetter();
            parameters.put(JRParameter.REPORT_LOCALE, Locale.US);
            Exportar exportar;
            DataSourceVenta dataSource = new DataSourceVenta();
            RnConsultas logic = new RnConsultas(path);
            List<BeanRegcontaItem> list = logic.listarVentaReporte(idRegconta);
            for (int i = 0; i < list.size(); i++) {
                BeanRegcontaItem beanRci = list.get(i);
                dataSource.add(beanRci);
            }
            String montoLetras = "";
            if (!list.isEmpty()) {
                montoLetras = conv.convertir(Double.parseDouble(list.get(0).getBeanRegcontaCab().getMonto().toString()),
                        list.get(0).getBeanRegcontaCab().getBeanMoneda().getIdMoneda());
            }
            parameters.put("MONTOLETRAS", montoLetras);
            parameters.put("P_NOMBRE_EMPRESA", usuario.getDescriempresa());
            parameters.put("P_DIRECCION_EMPRESA", usuario.getDireccion());
            parameters.put("P_RUC_EMPRESA", usuario.getRuc());
            parameters.put("P_TIPO_DOC", idTipoDoc);
            parameters.put("P_AUTORIZACION", beanRcc.getNumeroAutorizacion());
            parameters.put("P_CODIGO_MAQUINA", beanRcc.getCodigoMaquina());
            parameters.put("P_HORA_EMISION", UtilCenter.getHoraImpresion(idTipoDoc, idRegconta, path, logger));
            parameters.put("ABREV_MONEDA", UtilCenter.getMonedaRpt(beanRcc.getIdMoneda()));
            parameters.put("CONDICION_PAGO", UtilCenter.getCondicionPago(beanRcc));
            BeanRegcontaAdicional rccAdic = this.getAdicionalVenta(idRegconta);
            parameters.put("NUM_OC", this.getNumOc(rccAdic));
            parameters.put("NUM_GUIA", this.getNumGuia(rccAdic));
            parameters.put("VENDEDOR", this.getVendedorVenta(idRegconta));
            parameters.put("URLRPT", beanRcc.getUrlRpt());
            parameters.put("P_URLIMGQR", chkImpresionQr.isSelected() ? Util.getUrlImgQr(beanRcc.getUrlImgQr()) : null);
            parameters.put("P_IMGLOGO", this.getClass().getResourceAsStream(Constans.PATH_LOGO_VENTA));
            exportar = new Exportar(parameters, dataSource, rutaJasper);
            exportar.vistaPrevia(view);
        } catch (Exception e) {
            throw e;
        }
    }

    private String getNumOc(BeanRegcontaAdicional rccAdic) {
        if (rccAdic == null) {
            return "";
        }
        if (Util.isBlank(rccAdic.getSerieOc()) || Util.isBlank(rccAdic.getPreimpresoOc())) {
            return "";
        }
        return rccAdic.getSerieOc() + " - " + rccAdic.getPreimpresoOc();
    }

    private String getNumGuia(BeanRegcontaAdicional rccAdic) {
        if (rccAdic == null) {
            return "";
        }
        if (Util.isBlank(rccAdic.getSerieGuia()) || Util.isBlank(rccAdic.getPreimpresoGuia())) {
            return "";
        }
        return rccAdic.getSerieGuia() + " - " + rccAdic.getPreimpresoGuia();
    }

    private BeanRegcontaAdicional getAdicionalVenta(String idRegconta) {
        try {
            RnConsultas logic = new RnConsultas(path);
            return logic.getAdicionalVenta(idRegconta);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            return null;
        }
    }

    private String getVendedorVenta(String idRegconta) {
        try {
            RnConsultas logic = new RnConsultas(path);
            return logic.getVendedorVenta(idRegconta);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            return null;
        }
    }

    private void impresionVentaCosto(String id_regconta, String idTipoDoc)
            throws Exception {
        try {
            String rutaJasper = Constans.PATH_RPT_VISTA_PREVIA;
            if (rutaJasper == null) {
                JOptionPane.showMessageDialog(this, "No se encuentra configurado reporte para " + idTipoDoc);
                return;
            }
            Map parameters = new HashMap();
            ConvertNumberToLetter conv = new ConvertNumberToLetter();
            parameters.put(JRParameter.REPORT_LOCALE, Locale.US);
            Exportar exportar;
            DataSourceVenta dataSource = new DataSourceVenta();
            RnConsultas logic = new RnConsultas(path);
            List<BeanRegcontaItem> list = logic.listarVentaReporte(id_regconta);
            for (int i = 0; i < list.size(); i++) {
                BeanRegcontaItem beanRci = list.get(i);
                dataSource.add(beanRci);
            }
            String montoLetras = "";
            if (!list.isEmpty()) {
                montoLetras = conv.convertir(Double.parseDouble(list.get(0).getBeanRegcontaCab().getMonto().toString()),
                        list.get(0).getBeanRegcontaCab().getBeanMoneda().getIdMoneda());
            }
            BeanRegcontaCab beanRcc = list.get(0).getBeanRegcontaCab();
            parameters.put("P_NOMBRE_EMPRESA", usuario.getDescriempresa());
            parameters.put("P_DIRECCION_EMPRESA", usuario.getDireccion());
            parameters.put("P_RUC_EMPRESA", usuario.getRuc());
            parameters.put("P_TIPO_DOC", idTipoDoc);
            parameters.put("MONTOLETRAS", montoLetras);
            parameters.put("NUM_OC", beanRcc.getNumeroAutorizacion());
            parameters.put("NUM_LETRA", beanRcc.getCodigoMaquina());
            parameters.put("NUM_GUIA", beanRcc.getNumeroGuia());
            parameters.put("ABREV_MONEDA", this.getAbrevMonedaRpt(beanRcc.getBeanMoneda().getIdMoneda()));
            parameters.put("CONDICION", UtilCenter.getCondicionPago(beanRcc));
            parameters.put(JRParameter.REPORT_LOCALE, Locale.US);
            exportar = new Exportar(parameters, dataSource, rutaJasper);
            exportar.vistaPrevia(true);
        } catch (Exception e) {
            throw e;
        }
    }

    private String getAbrevMonedaRpt(String idMoneda) {
        if (idMoneda.equals(MonedaEnum.SOLES.getValue())) {
            return "S/. ";
        }
        return "$ ";
    }

    @Override
    public void controlAdd() {
    }

    @Override
    public void controlModify() {
    }

    @Override
    public void controlNullify() {
        try {
            if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
                return;
            }

            if (!this.validateAnular()) {
                return;
            }

            setCursor(new Cursor(Cursor.WAIT_CURSOR));

            if (registeri == null) {
                registeri = new RegisterBoleta("Detalle de Documento de Venta", usuario, frame);
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
            } else {
                registeri.selectInternalFrame();
            }

            setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private boolean validateAnular() throws Exception {
        int visibleRowIndex = table.getSelectedRow();
        int realRowIndex = table.convertRowIndexToModel(visibleRowIndex);
        ContaCab rcc = modeltable.getRegContaCab(realRowIndex);
        RnRegContaCab logicRcc = new RnRegContaCab(path);
        String idEstado = logicRcc.getIdestado(rcc.getRcIdregconta());
        RnEstadoDocumento logicEstado = new RnEstadoDocumento(path);
        String descripcion = logicEstado.getDescripcion(idEstado);
        if (!Constans.SWDESPACHO) {
            if (idEstado.trim().equals(EstadoDocumentoEnum.PARCIAL_ATENDIDO.getValue()) || idEstado.trim().equals(EstadoDocumentoEnum.ATENDIDO.getValue())) {
                JOptionPane.showMessageDialog(frame, "No se puede anular un documento en estado : " + descripcion + ". \n Primero debe anular sus despachos.", "Anular Documento", JOptionPane.INFORMATION_MESSAGE);
                return false;
            }
        }

        if (idEstado.trim().equals(EstadoDocumentoEnum.ANULADO.getValue())) {
            JOptionPane.showMessageDialog(frame, "El documento ya esta " + descripcion.substring(0, 1).toUpperCase() + descripcion.substring(1, descripcion.length()).toLowerCase() + ". ", "Anular Documento", JOptionPane.INFORMATION_MESSAGE);
            return false;
        }
        ContaCab r = new ContaCab();
        r.setIdPuntoventa(usuario.getCodpuntoventa());
        r.setIdTipoDoc(rcc.getIdTipoDoc());
        r.setSerie(rcc.getSerie());
        r.setPreimpreso(rcc.getPreimpreso());
        r.setIdAuxiliar(AuxiliarEnum.CAJA.getValue());

        String existe_liquidacion = logicRcc.existeLiquidacion(r);

        if (existe_liquidacion.trim().equals("S")) {
            JOptionPane.showMessageDialog(frame, "No se puede anular un documento que ya tiene Liquidación de Caja. \n Primero debe anular la Liquidación de Caja("
                    + rcc.getRcIdregconta()
                    + ").",
                    "Modificar Documento", JOptionPane.INFORMATION_MESSAGE);
            return false;
        }
        return true;
    }

    @Override
    public void controlEliminate() {
        try {
            if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
                return;
            }

            int visibleRowIndex = table.getSelectedRow();
            int realRowIndex = table.convertRowIndexToModel(visibleRowIndex);

            RnRegContaCab logicRcc = new RnRegContaCab(path);
            String idRegconta = modeltable.getRegContaCab(realRowIndex).getRcIdregconta();
            String idEstado = logicRcc.getIdestado(idRegconta);

            RnEstadoDocumento logicEstado = new RnEstadoDocumento(path);
            String descripcion = logicEstado.getDescripcion(idEstado);

            if (!idEstado.trim().equals("001")) {
                JOptionPane.showMessageDialog(frame, "El documento esta en estado " + descripcion.substring(0, 1).toUpperCase() + descripcion.substring(1, descripcion.length()).toLowerCase() + ". "
                        + "\n Para que el documento pueda ser eliminado debe estar en estado Anulado.", "Eliminar Documento", JOptionPane.INFORMATION_MESSAGE);
                return;
            }

            ContaCab r = new ContaCab();
            r.setIdPuntoventa(usuario.getCodpuntoventa());
            r.setIdTipoDoc(modeltable.getRegContaCab(realRowIndex).getIdTipoDoc());
            r.setSerie(modeltable.getRegContaCab(realRowIndex).getSerie());
            r.setPreimpreso(modeltable.getRegContaCab(realRowIndex).getPreimpreso());
            r.setIdAuxiliar("00010");

            String existe_liquidacion = logicRcc.existeLiquidacion(r);

            if (existe_liquidacion.trim().equals("S")) {
                JOptionPane.showMessageDialog(frame, "No se puede eliminar un documento que ya tiene Liquidación de Caja . \n Primero debe anular la Liquidación de Caja(" + modeltable.getRegContaCab(realRowIndex).getRcIdregconta() + ").", "Modificar Documento", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            int xres;
            xres = JOptionPane.showConfirmDialog(this,
                    "Seguro que desea eliminar el documento", "Sistema", JOptionPane.OK_CANCEL_OPTION, JOptionPane.QUESTION_MESSAGE);
            if (xres == JOptionPane.OK_OPTION) {
                logicRcc.eliminarRccVenta(idRegconta);
                JOptionPane.showMessageDialog(this, "Documento eliminado correctamente");
                cargarTabla();
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
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
            registeri = new RegisterBoleta("Detalle de Documento de Venta", usuario, frame);
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
        } else {
            registeri.selectInternalFrame();
        }

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    private String getParametroSistema(String idParametro) {
        try {
            RnParametro regla = new RnParametro(path);
            List<BeanParametro> listaBeanParametro = regla.listarParametro(idParametro, "A");
            if (listaBeanParametro.isEmpty()) {
                throw new Exception("Parámetro " + idParametro + " no existe");
            } else {
                BeanParametro bean = listaBeanParametro.get(0);
                return bean.getValor();
            }
        } catch (SQLException ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(null, ex.getMessage());
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(null, e.getMessage());
        }
        return null;
    }

    @Override
    public void controlClone() {
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
        this.cargarTabla();
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

    @Override
    public void cargarTabla() {
        try {
            ContaCab r = new ContaCab();
            r.setIdEmpresa(usuario.getCodempresa());
            r.setFInicial(fechaInicio);
            r.setFEmision(DateTime.format(1901, 0, 1));
            r.setFFinal(fechaFin);
            r.setIdAuxiliar(AuxiliarEnum.VENTA.getValue());
            RnRegContaCab regla = new RnRegContaCab(path);
            modeloOrdenado.setRowFilter(null);
            modeltable.clearTable();
            Set<String> localidades = new HashSet();
            //List<Usuario> lista = SessionSystem.usuariosConAcceso;
            List<Usuario> lista = UiLoginImpl.usuariosConAcceso;            
            Iterator<Usuario> i = lista.iterator();
            while (i.hasNext()) {
                localidades.add(i.next().getCodlocalidad());
            }
            r.setLocalidades(localidades);
            Set<String> pventas = new HashSet();
            Iterator<Usuario> j = lista.iterator();
            while (j.hasNext()) {
                pventas.add(j.next().getCodpuntoventa());
            }
            r.setPuntoVentas(pventas);
            modeltable.agregarVectorregcontacab(regla.listarDocumentosVentaSupervisor(r));
            cellEditorFE = new CellEditorBtnFactElect(modeltable, path, usuario);
            if (Constans.IS_FACTURADOR_SUNAT) {
                table.getColumnModel().getColumn(0).setCellEditor(cellEditorFE);
                table.getColumnModel().getColumn(0).setCellRenderer(cellEditorFE);
            }
            modeloOrdenado.setRowFilter(getFilter());
            table.setAllColumnPreferredWidth();
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    @Override
    public void focusLost(FocusEvent e
    ) {
        if (e.getSource().equals(txtSerie)) {
            FormatObject.formatSerie((JTextField) e.getSource());
            filtrar();
        }

        if (e.getSource() == txtPreimpreso && txtPreimpreso.getText().trim().length() > 0) {
            filtrar();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == cboTipoDoc) {
                txtSerie.requestFocus();
            }

            if (e.getSource() == txtSerie) {
                txtPreimpreso.requestFocus();
            }

            if (e.getSource() == txtPreimpreso) {
                cboEstado.requestFocus();
            }

            if (e.getSource() == cboEstado) {
                txtCliente.requestFocus();
            }
            if (e.getSource() == txtNumero) {
                cboCondicionPago.requestFocus();
            }

            if (e.getSource() == cboCondicionPago) {
                ((JTextFieldDateEditor) dcFechaInicio.getDateEditor()).requestFocus();
            }
        }
    }

    @Override
    public void propertyChange(PropertyChangeEvent evt) {
        if ((evt.getSource() == dcFechaInicio)
                || (evt.getSource() == dcFechaFin)) {
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
    public void controlSearch() {
        FormVentaItemReport form = new FormVentaItemReport(path);
        form.pack();
        form.setModal(true);
        form.setTitle("Generar Reporte de Venta por Items");
        form.setResizable(false);
        form.setLocationRelativeTo(null);
        form.setVisible(true);
    }

    @Override
    public Object getSelectedValue(String column) {
        return null;
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void setSelectedRow(String clave, int column) {
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void refreshTitleName() {
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
    public void itemStateChanged(ItemEvent e) {
        if (e.getSource().equals(cboLocalidad)) {
            cboPuntoVenta.removeAllItems();
            //List<Usuario> usuarios = SessionSystem.usuariosConAcceso;
            List<Usuario> usuarios = UiLoginImpl.usuariosConAcceso;
            Iterator<Usuario> i = usuarios.iterator();
            HashSet<String> puntoVentas = new HashSet();
            while (i.hasNext()) {
                Usuario u = i.next();
                if (u.getDescrilocalidad().equalsIgnoreCase(cboLocalidad.getSelectedItem().toString())) {
                    puntoVentas.add(u.getDescripuntoventa());
                }
            }
            Iterator<String> iterador = puntoVentas.iterator();
            cboPuntoVenta.addItem("TODOS");
            while (iterador.hasNext()) {
                cboPuntoVenta.addItem(iterador.next());
            }
            filtrar();
        }
        if (e.getSource().equals(cboPuntoVenta)) {
            filtrar();
        }
        if (e.getSource() == cboEstado) {
            if (cboEstado.getItemCount() > 0) {
                if (cboEstado.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }

        if (e.getSource() == cboTipoDoc) {
            if (cboTipoDoc.getItemCount() > 0) {
                if (cboTipoDoc.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }

        if (e.getSource() == cboCondicionPago) {
            if (cboCondicionPago.getItemCount() > 0) {
                if (cboCondicionPago.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }
    }
}
