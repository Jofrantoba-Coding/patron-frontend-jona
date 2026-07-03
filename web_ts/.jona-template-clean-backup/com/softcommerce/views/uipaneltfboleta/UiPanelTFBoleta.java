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
    protected JComboBox cboEstado;
    protected List<BeanEstadoDocumento> xestadoDocumento;
    protected JComboBox cboTipoDoc;
    protected JTextField txtSerie;
    protected JTextField txtPreimpreso;
    protected JTextField txtNumero;
    protected JTextField txtCliente;
    protected JComboBox cboCondicionPago;
    protected final Usuario usuario;
    protected final JDesktopPane jdp;
    protected final JFrame frame;
    protected RegisterBoleta registeri;
    protected Date fechaInicio;
    protected Date fechaFin;
    protected JDateChooser dcFechaInicio;
    protected JDateChooser dcFechaFin;
    protected JCheckBox chkImpresionQr;
    protected final JLabel lblLocalidad = new JLabel("Localidad");
    protected final JLabel lblPuntoVenta = new JLabel("P Venta");
    protected JComboBox cboLocalidad;
    protected JComboBox cboPuntoVenta;
    protected Gif gif;
    protected final Logger logger = Logger.getLogger(UiPanelTFBoleta.class);
    protected CellEditorBtnFactElect cellEditorFE;

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

    protected void inicialize() {
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
    }

    protected CondicionPagoEnum getCondicionPagoEnumNew(CondicionPagoEnum cpEnumOld) {
        if (cpEnumOld.equals(CondicionPagoEnum.CONTADO)) {
            return CondicionPagoEnum.CREDITO;
        }
        return CondicionPagoEnum.CONTADO;
    }

    protected CondicionPagoEnum getCondicionPagoEnum(String idCondicionPago) {
        try {
            return CondicionPagoEnum.get(idCondicionPago);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            return CondicionPagoEnum.CREDITO;
        }
    }

    @Override
    public void controlReport(boolean export) {
    }

    public void filtrar() {
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
        return null;
    }

    @Override
    public void cargarFiltro() {
    }

    protected void loadLocalidadCombo() {
    }

    public void loadCondPago() {
    }

    public void loadTipoDocumento() {
    }

    public void loadEstadoDocumento() {
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

    protected void exportarTxt(ContaCab beanRcc) throws Exception {
    }

    protected String getNameFile(String idTipoDoc, ContaCab beanRcc) {
        return this.usuario.getRuc() + "-" + idTipoDoc + "-" + beanRcc.getSerie() + "-" + beanRcc.getPreimpreso8Digs();
    }

    @Override
    public void controlPrint(boolean view) {
    }

    protected void impresion(ContaCab beanRcc, String idRegconta, String idTipoDoc, boolean view)
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

    protected void impresionContinua(String idRegconta, String idTipoDoc) {
    }

    protected void impresionNormal(ContaCab beanRcc, String idRegconta, String idTipoDoc, boolean view)
            throws Exception {
    }

    protected String getNumOc(BeanRegcontaAdicional rccAdic) {
        if (rccAdic == null) {
            return "";
        }
        if (Util.isBlank(rccAdic.getSerieOc()) || Util.isBlank(rccAdic.getPreimpresoOc())) {
            return "";
        }
        return rccAdic.getSerieOc() + " - " + rccAdic.getPreimpresoOc();
    }

    protected String getNumGuia(BeanRegcontaAdicional rccAdic) {
        if (rccAdic == null) {
            return "";
        }
        if (Util.isBlank(rccAdic.getSerieGuia()) || Util.isBlank(rccAdic.getPreimpresoGuia())) {
            return "";
        }
        return rccAdic.getSerieGuia() + " - " + rccAdic.getPreimpresoGuia();
    }

    protected BeanRegcontaAdicional getAdicionalVenta(String idRegconta) {
        return null;
    }

    protected String getVendedorVenta(String idRegconta) {
        return null;
    }

    protected void impresionVentaCosto(String id_regconta, String idTipoDoc)
            throws Exception {
    }

    protected String getAbrevMonedaRpt(String idMoneda) {
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
    }

    protected boolean validateAnular() throws Exception {
        return false;
    }

    @Override
    public void controlEliminate() {
    }

    @Override
    public void controlDetails() {
    }

    protected String getParametroSistema(String idParametro) {
        return null;
    }

    @Override
    public void controlClone() {
    }

    @Override
    public void controlClose() {
    }

    @Override
    public void controlRefresh() {
    }

    @Override
    public Object getSelectedValue(int column) {
        return null;
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
