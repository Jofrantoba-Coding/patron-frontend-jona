package com.softcommerce.views.uipnlreplibrocompras;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanRptVenta;
import com.softcommerce.beans.BeanTipoDocVenta;
import com.softcommerce.beans.Usuario;
import com.softcommerce.datasource.DataSourceRptVenta;
import com.softcommerce.util.Exportar;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnTipoDocVenta;
import com.softcommerce.reglasnegocio.RnLibros;
import com.softcommerce.tablemodel.TableModelTipoDoc;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JPanel;
import java.awt.BorderLayout;
import java.awt.Component;
import java.awt.FlowLayout;
import java.awt.Toolkit;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.swing.JInternalFrame;
import java.io.File;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import javax.swing.AbstractButton;
import javax.swing.JCheckBox;
import javax.swing.JOptionPane;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.UIManager;
import javax.swing.table.JTableHeader;
import javax.swing.table.TableCellRenderer;
import javax.swing.table.TableColumn;
import javax.swing.table.TableColumnModel;
import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import java.net.URL;
import net.sf.jasperreports.engine.JRDataSource;
import org.apache.log4j.Logger;

public class UiPnlRepLibroCompras 
        extends JInternalFrame 
        implements InterUiPnlRepLibroCompras, ActionListener {

    private JButton btnRepExcel;
    private JButton btnVstaPrevia;
    private JButton btnRepPd;
    private final URL path;
    private final Usuario usuario;
    private JComboBox cboMesIni;
    private JComboBox cboMesFin;
    private final String tipo;
    private Gif gif;
    private JTable tblTipoDoc;
    private TableModelTipoDoc modelTipoDoc;
    private CheckBoxHeader checkHeader;
    private JCheckBox chkConsolidadoTicket;
    private final Logger logger = Logger.getLogger(UiPnlRepLibroCompras.class);

    public UiPnlRepLibroCompras(String title, Main frm, Usuario usuario, URL path, String tipo) {
        super(title);
        this.path = path;
        this.usuario = usuario;
        this.tipo = tipo;
        inicialize();
        initListener();
    }

    private void inicialize() {
        gif = new Gif();
        JPanel pnlPrincipal = new JPanel();
        pnlPrincipal.setLayout(new BorderLayout());
        pnlPrincipal.add(getPnlNorte(), BorderLayout.NORTH);
        boolean isCompra = tipo.equals("compra");
        chkConsolidadoTicket.setVisible(!isCompra);
        if (!isCompra) {
            pnlPrincipal.add(getPnlCenter(), BorderLayout.CENTER);
        }
        pnlPrincipal.add(getPnlOpciones(), BorderLayout.SOUTH);
        getContentPane().add(pnlPrincipal);
        setMaximizable(false);
        setResizable(false);
        setClosable(true);
        pack();
        setIconifiable(true);
        setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2), (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);
    }

    private void initListener() {
        btnVstaPrevia.addActionListener(this);
        btnRepExcel.addActionListener(this);
        btnRepPd.addActionListener(this);
    }

    private JScrollPane getPnlCenter() {
        tblTipoDoc = new JTable();
        modelTipoDoc = new TableModelTipoDoc();
        tblTipoDoc.setModel(modelTipoDoc);
        JScrollPane scroll = new JScrollPane();
        scroll.setViewportView(tblTipoDoc);
        loadDocumentos();
        TableColumn tc = tblTipoDoc.getColumnModel().getColumn(0);
        tc.setCellEditor(tblTipoDoc.getDefaultEditor(Boolean.class));
        tc.setCellRenderer(tblTipoDoc.getDefaultRenderer(Boolean.class));
        checkHeader = new CheckBoxHeader();
        checkHeader.addListener(new MyItemListener());
        checkHeader.setSelected(true);
        tc.setHeaderRenderer(checkHeader);
        return scroll;
    }

    class MyItemListener implements ItemListener {

        @Override
        public void itemStateChanged(ItemEvent e) {
            Object source = e.getSource();
            if (source instanceof AbstractButton == false) {
                return;
            }
            boolean checked = e.getStateChange() == ItemEvent.SELECTED;
            for (int x = 0, y = tblTipoDoc.getRowCount(); x < y; x++) {
                tblTipoDoc.setValueAt(checked, x, 0);
            }
        }
    }

    class CheckBoxHeader extends JCheckBox
            implements TableCellRenderer, MouseListener {

        protected CheckBoxHeader rendererComponent;
        protected int column;
        protected boolean mousePressed = false;

        public CheckBoxHeader() {

        }

        public void addListener(ItemListener itemListener) {
            rendererComponent = this;
            rendererComponent.addItemListener(itemListener);
        }

        @Override
        public Component getTableCellRendererComponent(
                JTable table, Object value,
                boolean isSelected, boolean hasFocus, int row, int column) {
            if (table != null) {
                JTableHeader header = table.getTableHeader();
                if (header != null) {
                    rendererComponent.setForeground(header.getForeground());
                    rendererComponent.setBackground(header.getBackground());
                    rendererComponent.setFont(header.getFont());
                    header.addMouseListener(rendererComponent);
                }
            }
            setColumn(column);
            rendererComponent.setText("Selecionar Todo");
            setBorder(UIManager.getBorder("TableHeader.cellBorder"));
            return rendererComponent;
        }

        protected void setColumn(int column) {
            this.column = column;
        }

        public int getColumn() {
            return column;
        }

        protected void handleClickEvent(MouseEvent e) {
            if (mousePressed) {
                mousePressed = false;
                JTableHeader header = (JTableHeader) (e.getSource());
                JTable tableView = header.getTable();
                TableColumnModel columnModel = tableView.getColumnModel();
                int viewColumn = columnModel.getColumnIndexAtX(e.getX());
                int columnLocal = tableView.convertColumnIndexToModel(viewColumn);
                if (viewColumn == this.column && e.getClickCount() == 1 && columnLocal != -1) {
                    doClick();
                }
            }
        }

        @Override
        public void mouseClicked(MouseEvent e) {
            handleClickEvent(e);
            ((JTableHeader) e.getSource()).repaint();
        }

        @Override
        public void mousePressed(MouseEvent e) {
            mousePressed = true;
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

    private void loadDocumentos() {
        try {
            RnTipoDocVenta rn = new RnTipoDocVenta(Main.path);
            ArrayList<BeanTipoDocVenta> lista = rn.listarTipoDocVentaRv(Main.anio);
            modelTipoDoc.setData(lista);
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    private JPanel getPnlNorte() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.add(this.getPnlFiltro(), BorderLayout.NORTH);
        chkConsolidadoTicket = new JCheckBox("Consolidado Ticket");
        pnl.add(chkConsolidadoTicket, BorderLayout.CENTER);
        return pnl;
    }

    private JPanel getPnlFiltro() {
        JPanel pnl = new JPanel(new FlowLayout(FlowLayout.LEFT, 5, 5));
        JLabel lblInicio = new JLabel("Periodo Inicio:");
        pnl.add(lblInicio);
        cboMesIni = new JComboBox();
        cboMesIni.addItem("Enero");
        cboMesIni.addItem("Febrero");
        cboMesIni.addItem("Marzo");
        cboMesIni.addItem("Abril");
        cboMesIni.addItem("Mayo");
        cboMesIni.addItem("Junio");
        cboMesIni.addItem("Julio");
        cboMesIni.addItem("Agosto");
        cboMesIni.addItem("Setiembre");
        cboMesIni.addItem("Octubre");
        cboMesIni.addItem("Noviembre");
        cboMesIni.addItem("Diciembre");
        pnl.add(cboMesIni);
        JLabel lblFin = new JLabel("Periodo Fin:");
        pnl.add(lblFin);
        cboMesFin = new JComboBox();
        cboMesFin.addItem("Enero");
        cboMesFin.addItem("Febrero");
        cboMesFin.addItem("Marzo");
        cboMesFin.addItem("Abril");
        cboMesFin.addItem("Mayo");
        cboMesFin.addItem("Junio");
        cboMesFin.addItem("Julio");
        cboMesFin.addItem("Agosto");
        cboMesFin.addItem("Setiembre");
        cboMesFin.addItem("Octubre");
        cboMesFin.addItem("Noviembre");
        cboMesFin.addItem("Diciembre");
        pnl.add(cboMesFin);
        return pnl;
    }

    private JPanel getPnlOpciones() {
        JPanel pnl = new JPanel();
        btnVstaPrevia = new JButton("Vista Previa", gif.VistaPrevia);
        btnRepExcel = new JButton("Rep. Excel", gif.EXCEL);
        btnRepPd = new JButton("Rep. PDF", gif.ExportPdf);
        pnl.add(btnVstaPrevia);
        pnl.add(btnRepExcel);
        pnl.add(btnRepPd);
        return pnl;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (btnRepPd == e.getSource() || btnRepExcel == e.getSource() || btnVstaPrevia == e.getSource()) {
            try {
                String formato;
                if (btnRepExcel == e.getSource()) {
                    formato = "xlsx";
                } else {
                    formato = "pdf";
                }
                String mesIni = String.valueOf(cboMesIni.getSelectedIndex() + 1);
                String mesFin = String.valueOf(cboMesFin.getSelectedIndex() + 1);
                if (mesIni.length() == 1) {
                    mesIni = "0" + mesIni;
                }
                if (mesFin.length() == 1) {
                    mesFin = "0" + mesFin;
                }
                String rutaJasper;
                String nombre_archivo;
                Map parameters = new HashMap();
                //JRBeanCollectionDataSource dataSource;
                JRDataSource dataSource;
                if (tipo.equals("compra")) {
                    rutaJasper = Constans.PATH_RPT_JASPER + "rptLibroCompras.jasper";
                    nombre_archivo = "Compras";
                    dataSource = this.getDataSourceCompras(mesIni, mesFin);
                } else {
                    rutaJasper = Constans.PATH_RPT_JASPER + "rptLibroVentas.jasper";
                    nombre_archivo = "Ventas";
                    dataSource = this.getDataSourceVenta(mesIni, mesFin);
                }
                File file = File.createTempFile(nombre_archivo + (new Date()).getTime(), "." + formato);
                file.deleteOnExit();

                parameters.put("NOMBRE_EMPRESA", usuario.getDescriempresa());
                parameters.put("P_ANIO", Main.anio);
                parameters.put("RUC", usuario.getRuc());
                parameters.put("P_MES_INI", mesIni);
                parameters.put("P_MES_FIN", mesFin);
                parameters.put("TIPO_REPORTE", formato);
                parameters.put(JRParameter.REPORT_LOCALE, Locale.US);
                Exportar exportar;
                if (btnVstaPrevia == e.getSource()) {
                    exportar = new Exportar(parameters, dataSource, rutaJasper);
                    exportar.vistaPrevia(true);
                } else {
                    exportar = new Exportar(file, parameters, formato, dataSource, rutaJasper);
                    exportar.show();
                }
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, ex.getMessage());
            }
        }
    }

    private JRBeanCollectionDataSource getDataSourceCompras(String mesIni, String mesFin) throws Exception {
        try {
            List listaRpt = this.getListaCompra(mesIni, mesFin);
            JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(listaRpt);
            return dataSource;
        } catch (Exception e) {
            throw e;
        }
    }

    private JRDataSource getDataSourceVenta(String mesIni, String mesFin) throws Exception {
        try {
            List<BeanRptVenta> listaRpt = this.getListaVenta(mesIni, mesFin);
            DataSourceRptVenta dataSource = new DataSourceRptVenta();
            for (int i = 0; i < listaRpt.size(); i++) {
                BeanRptVenta beanVta = listaRpt.get(i);
                dataSource.add(beanVta);
            }
            return dataSource;
        } catch (Exception e) {
            throw e;
        }
    }

    private List<BeanRptVenta> getListaVenta(String mesIni, String mesFin) throws Exception {
        try {
            RnLibros regla = new RnLibros(path);
            List<BeanTipoDocVenta> listDv = modelTipoDoc.getDataSelected();
            if (listDv.isEmpty()) {
                throw new Exception("Seleccione al menos un registro para filtrar");
            }
            return regla.reportLibroVentaRn(Main.anio, mesIni, mesFin, chkConsolidadoTicket.isSelected(),
                    listDv.size() == modelTipoDoc.getRowCount(), listDv);
        } catch (Exception e) {
            throw e;
        }
    }

    private List getListaCompra(String mesIni, String mesFin) throws Exception {
        try {
            RnLibros regla = new RnLibros(path);
            return regla.reportLibroCompra(Main.anio, mesIni, mesFin);
        } catch (Exception e) {
            throw e;
        }
    }
    
}
