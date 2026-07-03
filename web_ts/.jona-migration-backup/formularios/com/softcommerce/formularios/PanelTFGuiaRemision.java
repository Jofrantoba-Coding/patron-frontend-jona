package com.softcommerce.formularios;

import com.softcommerce.beans.BeanEstadoDocumento;
import com.softcommerce.beans.BeanGuiaReporte;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.MotivoTraslado;
import com.softcommerce.beans.Usuario;
import com.softcommerce.datasource.DataSourceGuia;
import com.softcommerce.enums.TipoDocVentaEnum;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import java.awt.BorderLayout;
import com.softcommerce.general.controles.CTable;
import java.beans.PropertyChangeEvent;
import java.awt.Color;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.util.Date;
import javax.swing.JScrollPane;
import javax.swing.event.ListSelectionEvent;
import javax.swing.table.TableRowSorter;
import com.softcommerce.report.Reporte;
import javax.swing.event.ListSelectionListener;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.CuadroMensaje;
import java.awt.Cursor;
import java.awt.Component;
import java.awt.event.ActionListener;
import java.awt.event.FocusListener;
import java.awt.event.KeyListener;
import java.awt.event.ActionEvent;
import java.awt.event.FocusEvent;
import java.awt.event.KeyEvent;
import java.beans.PropertyChangeListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JComboBox;
import javax.swing.JDesktopPane;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.RowFilter;
import javax.swing.RowFilter.ComparisonType;
import javax.swing.border.LineBorder;
import javax.swing.event.InternalFrameEvent;
import com.softcommerce.reglasnegocio.RnEstadoDocumento;
import com.softcommerce.reglasnegocio.RnMotivoTraslado;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.general.tablas.GuiaTableModel;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnMovInventarioCab;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.ExportExcel;
import com.softcommerce.util.Exportar;
import com.softcommerce.util.FactElectTxt;
import com.softcommerce.util.FormatObject;
import com.softcommerce.util.LayoutUtil;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import javax.swing.JComponent;
import javax.swing.KeyStroke;
import net.sf.jasperreports.engine.JRParameter;
import org.apache.log4j.Logger;

public class PanelTFGuiaRemision
        extends JHInternalFrame
        implements ListSelectionListener, FocusListener, KeyListener, ActionListener, PropertyChangeListener {

    private JTextField txtGuiaSerie;
    private JTextField txtGuiareimpreso;
    private JTextField txtDocumentoventaidtipodoc;
    private JTextField txtDocumentoventaserie;
    private JTextField txtDocumentoventapreimpreso;
    private List<BeanEstadoDocumento> xestadoDocumento;
    private JComboBox cboEstado;
    private JTextField txtTmpruc;
    private JTextField txtTmpanexo;
    private JTextField txtIdmovimientoorigen;
    private JTextField txtIdmovimientodestino;
    private List<MotivoTraslado> xmotivo;
    private JComboBox cboIdmotivo;
    public CTable table;
    public GuiaTableModel modeltable;
    public TableRowSorter<GuiaTableModel> modeloOrdenado;
    public JScrollPane scroll;
    private final JDesktopPane jdp;
    private final Usuario usuario;
    private final JFrame frame;
    private RegisterGuiaRemision registeri;
    private Date fechaInicio;
    private Date fechaFin;
    private JDateChooser dcFechainicio;
    private JDateChooser dcFechafin;
    private CuadroMensaje cuadro = null;
    private final Logger logger = Logger.getLogger(PanelTFGuiaRemision.class);

    public PanelTFGuiaRemision(String title, JFrame frame, JDesktopPane jdp, Usuario usuario) {
        super(title + " - PanelTFGuiaRemision");
        this.usuario = usuario;
        this.frame = frame;
        this.jdp = jdp;
        inicialize();
        cuadro = new CuadroMensaje(this.usuario);
    }

    public PanelTFGuiaRemision(String title, JFrame frame, JDesktopPane jdp, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        this.jdp = jdp;
        inicialize();
        cuadro = new CuadroMensaje(this.usuario);
    }

    public PanelTFGuiaRemision(String title, JFrame frame, JDesktopPane jdp, Usuario usuario, boolean vendedor) {
        super(title + " - PanelTFGuiaRemision", true, false, false, true, false, true, true, true, true, true, true, true, true);
        this.usuario = usuario;
        this.frame = frame;
        this.jdp = jdp;
        inicialize();
    }

    private void inicialize() {
        modeltable = new GuiaTableModel();
        modeloOrdenado = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        table.getSelectionModel().addListSelectionListener(this);
        scroll = new JScrollPane(table);

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
        table.setNoVisibleColumn(14);
        table.setNoVisibleColumn(15);
        table.setNoVisibleColumn(16);
        table.setNoVisibleColumn(17);
        table.setNoVisibleColumn(18);
        table.setNoVisibleColumn(19);
        table.setNoVisibleColumn(20);
        table.setNoVisibleColumn(21);
        table.setNoVisibleColumn(22);
        table.setNoVisibleColumn(23);
        table.setNoVisibleColumn(24);
        table.setNoVisibleColumn(25);
        table.setNoVisibleColumn(28);
        table.setNoVisibleColumn(29);
        table.setNoVisibleColumn(30);
        table.setNoVisibleColumn(31);
        table.setNoVisibleColumn(35);
        table.setNoVisibleColumn(37);
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
        table.moveColumn(6, 4);
        table.moveColumn(9, 5);
        table.moveColumn(12, 6);
        table.moveColumn(11, 7);

        JPanel pnlaux = new JPanel();
        pnlaux.setLayout(new BorderLayout());
        JPanel panel = getPanelFilter();
        pnlaux.add(panel, BorderLayout.PAGE_START);
        pnlaux.add(scroll, BorderLayout.CENTER);
        this.initListener();
        this.setTable(pnlaux);
    }

    private void initListener() {
        txtIdmovimientoorigen.addKeyListener(this);
        txtIdmovimientoorigen.addFocusListener(this);
        txtIdmovimientodestino.addKeyListener(this);
        txtIdmovimientodestino.addFocusListener(this);
        cboIdmotivo.addActionListener(this);
        cboIdmotivo.addKeyListener(this);
        txtGuiaSerie.addKeyListener(this);
        txtGuiaSerie.addFocusListener(this);
        txtGuiareimpreso.addKeyListener(this);
        txtGuiareimpreso.addFocusListener(this);
        txtDocumentoventaidtipodoc.addKeyListener(this);
        txtDocumentoventaidtipodoc.addFocusListener(this);
        txtDocumentoventaserie.addKeyListener(this);
        txtDocumentoventaserie.addFocusListener(this);
        txtDocumentoventapreimpreso.addKeyListener(this);
        txtDocumentoventapreimpreso.addFocusListener(this);
        txtTmpanexo.addKeyListener(this);
        txtTmpanexo.addFocusListener(this);
        txtTmpruc.addFocusListener(this);
        txtTmpruc.addKeyListener(this);
        dcFechainicio.getJCalendar().addFocusListener(this);
        dcFechainicio.getJCalendar().addKeyListener(this);
        dcFechainicio.getCalendarButton().addActionListener(this);
        dcFechainicio.addPropertyChangeListener(this);
        dcFechainicio.addKeyListener(this);
        dcFechainicio.addFocusListener(this);

        ((JTextField) dcFechainicio.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                ((JTextFieldDateEditor) dcFechafin.getDateEditor()).requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dcFechainicio.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dcFechainicio.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        dcFechafin.getJCalendar().addFocusListener(this);
        dcFechafin.getJCalendar().addKeyListener(this);
        dcFechafin.getCalendarButton().addActionListener(this);
        dcFechafin.addPropertyChangeListener(this);
        dcFechafin.addKeyListener(this);
        dcFechafin.addFocusListener(this);
        ((JTextField) dcFechafin.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                cboEstado.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dcFechafin.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dcFechafin.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);

        cboEstado.addActionListener(this);
        cboEstado.addKeyListener(this);

        table.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                    controlDetails();
                }
            }
        });
    }

    public JPanel getPanelFilter() {
        JPanel pnlPrinc = new JPanel(new BorderLayout());
        pnlPrinc.setBorder(new LineBorder(new Color(130, 135, 144)));
        JPanel pnl = new JPanel(new GridBagLayout());
        pnlPrinc.add(pnl, BorderLayout.WEST);
        GridBagConstraints gbc = LayoutUtil.getGbc();
        JLabel lblCodigoOrigen = new JLabel("Cod. Orig.");
        pnl.add(lblCodigoOrigen, gbc);

        txtIdmovimientoorigen = new JTextField();
        txtIdmovimientoorigen.setColumns(6);
        txtIdmovimientoorigen.setDocument(new IntegerDocument(10));
        gbc.gridx = 1;
        gbc.gridwidth = 2;
        pnl.add(txtIdmovimientoorigen, gbc);
        gbc.gridwidth = 1;

        JLabel lblCodigoDestino = new JLabel("Cod. Dest.");
        gbc.gridx = 4;
        pnl.add(lblCodigoDestino, gbc);

        txtIdmovimientodestino = new JTextField();
        txtIdmovimientodestino.setColumns(6);
        txtIdmovimientodestino.setDocument(new IntegerDocument(10));
        gbc.gridx = 5;
        gbc.gridwidth = 2;
        pnl.add(txtIdmovimientodestino, gbc);
        gbc.gridwidth = 1;

        JLabel lblMotivo = new JLabel("Motivo");
        gbc.gridx = 8;
        gbc.anchor = GridBagConstraints.EAST;
        pnl.add(lblMotivo, gbc);
        gbc.anchor = GridBagConstraints.WEST;

        cboIdmotivo = new JComboBox();
        gbc.gridx = 9;
        pnl.add(cboIdmotivo, gbc);

        JLabel lblNumGuia = new JLabel("N° Guia");
        gbc.gridx = 0;
        gbc.gridy = 1;
        pnl.add(lblNumGuia, gbc);

        txtGuiaSerie = new JTextField();
        FormatObject.formatJTextFieldSerie(txtGuiaSerie);
        txtGuiaSerie.setForeground(Color.BLACK);
        gbc.gridx = 1;
        gbc.insets = new Insets(2, 2, 2, 0);
        pnl.add(txtGuiaSerie, gbc);

        txtGuiareimpreso = new JTextField();
        FormatObject.formatJTextFieldPreimpreso(txtGuiareimpreso);
        txtGuiareimpreso.setForeground(Color.BLACK);
        gbc.gridx = 2;
        gbc.gridwidth = 2;
        gbc.insets = new Insets(2, 0, 2, 2);
        pnl.add(txtGuiareimpreso, gbc);
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.gridwidth = 1;

        JLabel lblNumDocRef = new JLabel("N° Doc. Ref.");
        gbc.gridx = 4;
        pnl.add(lblNumDocRef, gbc);
        txtDocumentoventaidtipodoc = new JTextField();
        txtDocumentoventaidtipodoc.setDocument(new IntegerDocument(2));
        txtDocumentoventaidtipodoc.setForeground(Color.BLACK);
        txtDocumentoventaidtipodoc.setColumns(3);
        gbc.insets = new Insets(2, 2, 2, 0);
        gbc.gridx = 5;
        pnl.add(txtDocumentoventaidtipodoc, gbc);

        txtDocumentoventaserie = new JTextField();
        FormatObject.formatJTextFieldSerie(txtDocumentoventaserie);
        txtDocumentoventaserie.setForeground(Color.BLACK);
        gbc.insets = new Insets(2, 0, 2, 0);
        gbc.gridx = 6;
        pnl.add(txtDocumentoventaserie, gbc);

        txtDocumentoventapreimpreso = new JTextField();
        FormatObject.formatJTextFieldPreimpreso(txtDocumentoventapreimpreso);
        txtDocumentoventapreimpreso.setForeground(Color.BLACK);
        gbc.insets = new Insets(2, 0, 2, 2);
        gbc.gridx = 7;
        gbc.gridwidth = 2;
        pnl.add(txtDocumentoventapreimpreso, gbc);
        gbc.gridwidth = 1;
        gbc.insets = new Insets(2, 2, 2, 2);

        JLabel lblRazonSocial = new JLabel("R. Social");
        gbc.gridx = 0;
        gbc.gridy = 2;
        pnl.add(lblRazonSocial, gbc);

        txtTmpanexo = new JTextField();
        txtTmpanexo.setDocument(new UpperCaseNumberDocument(255));
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.gridx = 1;
        gbc.gridwidth = 3;
        pnl.add(txtTmpanexo, gbc);
        gbc.fill = GridBagConstraints.NONE;
        gbc.gridwidth = 1;

        JLabel lblRucCliente = new JLabel("RUC/DNI");
        gbc.gridx = 4;
        pnl.add(lblRucCliente, gbc);

        txtTmpruc = new JTextField();
        txtTmpruc.setDocument(new IntegerDocument(11));
        txtTmpruc.setColumns(10);
        gbc.gridx = 5;
        gbc.gridwidth = 3;
        pnl.add(txtTmpruc, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 3;
        JLabel lblFechaInicio = new JLabel("Fecha Inicio");
        lblFechaInicio.setDisplayedMnemonic('c');
        pnl.add(lblFechaInicio, gbc);

        dcFechainicio = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        gbc.gridx = 1;
        gbc.gridwidth = 2;
        pnl.add(dcFechainicio, gbc);
        gbc.gridwidth = 1;

        JLabel lblFechaFin = new JLabel("Fecha Fin");
        lblFechaFin.setDisplayedMnemonic('a');
        gbc.gridx = 4;
        pnl.add(lblFechaFin, gbc);

        dcFechafin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        gbc.gridx = 5;
        gbc.gridwidth = 3;
        pnl.add(dcFechafin, gbc);
        gbc.gridwidth = 1;

        JLabel lblEstado = new JLabel("Estado");
        gbc.gridx = 8;
        gbc.anchor = GridBagConstraints.EAST;
        pnl.add(lblEstado, gbc);
        gbc.anchor = GridBagConstraints.WEST;

        cboEstado = new JComboBox();
        gbc.gridx = 9;
        pnl.add(cboEstado, gbc);

        return pnlPrinc;
    }

    private String getPrint() {
        String parametro = "SELECT "
                + " NVL(M.DIRECCION_LLEGADA, A2.DIRECCION)                   AS PV_DESTINO_DIRECCION "
                + " ,NVL(AL.DIRECCION,'')                                   as PV_ORIGEN_DIRECCION "
                + " ,(CASE WHEN M.ID_ESTADO = '001' THEN 'DOCUMENTO ANULADO' ELSE NVL(RC.TMP_ANEXO,(CASE WHEN M.ID_TIPO_MOV = '011' THEN M.TMP_ANEXO ELSE E.NOMBRE END)) END) AS EMPRESA "
                + " ,(CASE WHEN M.ID_ESTADO = '001' THEN 'NT' ELSE NVL(RC.TMP_RUC,(CASE WHEN M.ID_TIPO_MOV = '011' THEN M.TMP_RUC ELSE E.RUC END)) END) AS RUC_EMPRESA              "
                + " ,NVL(M.FECHA_EMISION, TO_DATE('20020101','YYYYMMDD'))     AS FECHA_EMISION "
                + " ,NVL(M.FEC_INI_TRASLADO, TO_DATE('20020101','YYYYMMDD'))  AS FEC_INI_TRASLADO "
                + " ,NVL(AN2.DESCRIPCION,'')                                  AS EMPRESA_TRANSPORTISTA "
                + " ,NVL(AN2.NUMERO,'')                                       as RUC_EMPRESA_TRANSPORTISTA "
                + " ,(CASE WHEN M.SERIE_REF1 IS NULL OR M.PREIMPRESO_REF1 IS NULL OR M.ID_TIPO_DOC_REF1 IS NULL THEN '' ELSE M.ID_TIPO_DOC_REF1 || \'/\' ||  M.SERIE_REF1 || TO_CHAR(CHR(45)) || M.PREIMPRESO_REF1 END) AS SERIE_PREIMPRESO_DOCVEN_REF "
                + " ,(CASE WHEN MAV.DESCRIPCION IS NULL OR MOV.DESCRIPCION IS NULL THEN '' ELSE MAV.DESCRIPCION || TO_CHAR(CHR(45)) || MOV.DESCRIPCION END) AS MARCA_MODELO "
                + " ,NVL(V.CONSTANCIA_INSCRIPCION,'')                         AS CONSTANCIA_INSCRIPCION "
                + " ,NVL(AN3.NRO_LICENCIA,'')                                 AS NRO_LICENCIA "
                + " ,NVL(M.ID_MOTIVO_TRASLADO,'')                             AS ID_MOTIVO_TRASLADO "
                + " ,NVL(AN3.DESCRIPCION,'')                                  AS CHOFER "
                + " ,(CASE WHEN M.SERIE_REF IS NULL OR M.PREIMPRESO_REF IS NULL THEN '' ELSE M.SERIE_REF || TO_CHAR(CHR(45)) || M.PREIMPRESO_REF END) AS SERIE_PREIMPRESO_GUIA_REF "
                + " ,NVL(V.PLACA,'')                                          AS PLACA "
                + " FROM MOV_INVENTARIO_CAB M "
                + " LEFT JOIN MOV_INVENTARIO_CAB M2 ON M.ID_TIPO_DOC_REF = M2.ID_TIPO_DOC_REF AND M.SERIE_REF = M2.SERIE_REF AND M.PREIMPRESO_REF = M2.PREIMPRESO_REF AND TO_CHAR(M.FECHA_EMISION,'YYYY')=TO_CHAR(M2.FECHA_EMISION,'YYYY') AND M2.TIPO = 'E' AND (M2.\"_ESTADO\" IS NULL OR M2.\"_ESTADO\" = 'A') ";

        if (modeltable.getGuia(table.convertRowIndexToModel(table.getSelectedRow())).getIdTipoMov().equals("010")) {
            parametro = parametro + " And (M2.Id_Tipo_Doc Is Null And M2.Serie Is Null And M2.Preimpreso Is Null) ";
        }

        parametro = parametro + " LEFT JOIN ALMACEN AL ON M.ID_ALMACEN = AL.ID_ALMACEN "
                + " LEFT JOIN ALMACEN A2 ON M2.ID_ALMACEN = A2.ID_ALMACEN "
                + " LEFT JOIN PUNTO_VENTA PVO ON AL.ID_PUNTO_VENTA = PVO.ID_PUNTO_VENTA "
                + " LEFT JOIN PUNTO_VENTA PVD ON A2.ID_PUNTO_VENTA = PVD.ID_PUNTO_VENTA "
                + " LEFT JOIN REGCONTA_CAB RC ON M.ID_REGCONTA_DOC1 = RC.ID_REGCONTA "
                + " LEFT JOIN ANEXO AN2 ON M.ID_ANEXO_EMPRESA_TRANSPORTISTA = AN2.ID_ANEXO "
                + " left join VEHICULO V on M.ID_VEHICULO = V.ID_VEHICULO "
                + " left join MARCA_VEHICULO MAV on V.ID_MARCA = MAV.ID_MARCA "
                + " LEFT JOIN MODELO_VEHICULO MOV ON V.ID_MODELO = MOV.ID_MODELO "
                + " LEFT JOIN ANEXO AN3 ON M.ID_ANEXO_TRANSPORTISTA = AN3.ID_ANEXO "
                + " LEFT JOIN EMPRESA E ON M.ID_EMPRESA = E.ID_EMPRESA "
                + " LEFT JOIN ANEXO AN4 ON M.ID_ANEXO = AN4.ID_ANEXO "
                + "  WHERE 1 = 1 "
                + " AND M.ID_TIPO_DOC_REF = '09' "
                + " AND M.TIPO = 'S' "
                + " AND M.\"_ESTADO\" = 'A' "
                + " AND M.ID_MOVIMIENTO = \'" + modeltable.getGuia(table.convertRowIndexToModel(table.getSelectedRow())).getIdMovimiento() + "\' ";

        return parametro;
    }

    private String getPrintSubreport() {
        String parametro = " SELECT "
                + "  M.ID_MOVIMIENTO_DET              "
                + " ,M.ID_MOVIMIENTO                  "
                + " ,M.TIPO                           "
                + " ,M.ID_TIPO_MOVIMIENTO             "
                + " ,M.ID_EMPRESA                     "
                + " ,M.ID_LOCALIDAD                   "
                + " ,M.ID_ALMACEN                     "
                + " ,M.ID_TIPO_DOC                    "
                + " ,M.SERIE                          "
                + " ,M.PREIMPRESO                     "
                + " ,M.ID_ITEM                        "
                + " ,M.PRECIO_ITEM                    "
                + " ,M.CANTIDAD                       "
                + " ,M.DESCUENTO                      "
                + " ,M.AFECTO                         "
                + " ,M.NOAFECTO                       "
                + " ,M.IGV                            "
                + " ,M.MONTO                          "
                + " ,M.ID_UM                          "
                + " ,M.FLAGTIPOPROD                   "
                + " ,M.PESO_TOTAL                     "
                + " ,M.AFECTO + M.NOAFECTO AS VALORVENTA "
                + " ,M.AFECTO + M.NOAFECTO + M.IGV AS PRECIOVENTA "
                + " ,I.DESCRIPCION AS ITEM           "
                + " ,I.UM_COMPRA                     "
                + " ,I.ID_ALTERNO "
                + " ,UM.DESCRIPCION AS UNIDADMEDIDA  "
                + " ,UM.ABREV AS ABREV_UM   "
                + " ,I.ID_MARCA                       "
                + " ,MAR.DESCRIPCION AS MARCA         "
                + " ,MC.ID_ANEXO AS ID_ANEXO          "
                + " ,AN.DESCRIPCION AS ANEXO          "
                + " ,MC.FECHA_EMISION                 "
                + " ,AL.DESCRIPCION AS ALMACEN            "
                + " FROM MOV_INVENTARIO_DET M "
                + " LEFT JOIN ITEM I ON M.ID_ITEM = I.ID_ITEM "
                + " LEFT JOIN UNIDAD_MEDIDA UM ON UM.ID_UM = I.UM_COMPRA "
                + " LEFT JOIN MARCA MAR ON MAR.ID_MARCA = I.ID_MARCA "
                + " LEFT JOIN MOV_INVENTARIO_CAB MC ON M.ID_MOVIMIENTO = MC.ID_MOVIMIENTO AND M.SERIE = MC.SERIE AND M.PREIMPRESO = MC.PREIMPRESO AND M.ID_TIPO_DOC = MC.ID_TIPO_DOC "
                + " LEFT JOIN ANEXO AN ON MC.ID_ANEXO = AN.ID_ANEXO "
                + " left join ALMACEN AL on M.ID_ALMACEN = AL.ID_ALMACEN "
                + " where  M.ID_MOVIMIENTO = \'" + modeltable.getGuia(table.convertRowIndexToModel(table.getSelectedRow())).getIdMovimiento() + "\' "
                + " and M.\"_ESTADO\" = 'A' "
                + " ORDER BY I.DESCRIPCION ";

        return parametro;
    }

    @Override
    public void controlReport(boolean export) {
        if (table.getRowCount() == 0) {
            return;
        }

        Map parameters = new HashMap();
        parameters.put(0, usuario.getDescriempresa());
        parameters.put(1, "Ruc: " + usuario.getRuc());
        parameters.put(2, "Guia Remisión");
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

        dcFechainicio.setSelectableDateRange(fechaInicio, fechaFin);
        dcFechafin.setSelectableDateRange(fechaInicio, fechaFin);
        dcFechainicio.setDate(fechaInicio);
        dcFechafin.setDate(fechaFin);
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txtTmpanexo)
                    || (e.getSource() == txtIdmovimientoorigen)
                    || (e.getSource() == txtIdmovimientodestino)
                    || (e.getSource() == txtTmpruc)
                    || (e.getSource() == txtDocumentoventaidtipodoc)
                    || (e.getSource() == txtDocumentoventaserie)
                    || (e.getSource() == txtDocumentoventapreimpreso)
                    || (e.getSource() == txtGuiaSerie)
                    || (e.getSource() == txtGuiareimpreso)) {
                filtrar();
            }
        }
    }

    public RowFilter<Object, Object> getFilter() {
        List<RowFilter<Object, Object>> filters = new ArrayList();

        if (cboEstado.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xestadoDocumento.get(cboEstado.getSelectedIndex() - 1).getIdEstado() + ".*", 22));
        }

        if (txtTmpanexo.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtTmpanexo.getText().trim() + ".*", 33));
        }

        if (cboIdmotivo.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xmotivo.get(cboIdmotivo.getSelectedIndex() - 1).getCodigo() + ".*", 23));
        }

        if (txtIdmovimientoorigen.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtIdmovimientoorigen.getText().trim() + ".*", 1));
        }

        if (txtIdmovimientodestino.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtIdmovimientodestino.getText().trim() + ".*", 2));
        }

        if (txtTmpruc.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtTmpruc.getText().trim() + ".*", 34));
        }

        if (txtGuiaSerie.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtGuiaSerie.getText().trim() + ".*", 10));
        }

        if (txtGuiareimpreso.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtGuiareimpreso.getText().trim() + ".*", 11));
        }

        if (txtDocumentoventaidtipodoc.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtDocumentoventaidtipodoc.getText().trim() + ".*", 15));
        }

        if (txtDocumentoventaserie.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtDocumentoventaserie.getText().trim() + ".*", 16));
        }

        if (txtDocumentoventapreimpreso.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtDocumentoventapreimpreso.getText().trim() + ".*", 17));
        }

        if (!((JTextFieldDateEditor) dcFechainicio.getDateEditor()).getText().equals("__/__/____")
                && !((JTextFieldDateEditor) dcFechafin.getDateEditor()).getText().equals("__/__/____")) {
            if (DateTime.isValidDate(((JTextFieldDateEditor) dcFechainicio.getDateEditor()).getText())
                    && DateTime.isValidDate(((JTextFieldDateEditor) dcFechafin.getDateEditor()).getText())) {
                filters.add(RowFilter.dateFilter(ComparisonType.AFTER, DateTime.getDateMinusOrPlus(dcFechainicio.getDate(), -1), 13));
                filters.add(RowFilter.dateFilter(ComparisonType.BEFORE, DateTime.getDateMinusOrPlus(dcFechafin.getDate(), 1), 13));
            }
        }

        RowFilter<Object, Object> fooBarFilter = RowFilter.andFilter(filters);

        return fooBarFilter;
    }

    @Override
    public void cargarFiltro() {
        loadEstadoDocumento();
        loadMotivo();
    }

    public void loadEstadoDocumento() {
        RnEstadoDocumento reglaFamilia = new RnEstadoDocumento(path);

        if (xestadoDocumento != null) {
            xestadoDocumento.clear();
        } else {
            xestadoDocumento = new ArrayList();
        }
        xestadoDocumento.addAll(reglaFamilia.listarGeneral());
        cboEstado.removeAllItems();
        cboEstado.addItem("--- TODOS ---");
        for (Integer i = 0; i < xestadoDocumento.size(); i++) {
            cboEstado.addItem(xestadoDocumento.get(i).getDescripcion());
        }

        cboEstado.setSelectedIndex(0);
    }

    public void loadMotivo() {
        RnMotivoTraslado reglaTipoDoc = new RnMotivoTraslado(path);

        if (xmotivo != null) {
            xmotivo.clear();
        } else {
            xmotivo = new ArrayList();
        }
        xmotivo.addAll(reglaTipoDoc.listarGeneral());

        cboIdmotivo.removeAllItems();
        cboIdmotivo.addItem("--- TODOS ---");

        for (int i = 0; i < xmotivo.size(); i++) {
            cboIdmotivo.addItem(xmotivo.get(i).getDescripcion());
        }

        cboIdmotivo.setSelectedIndex(0);
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() instanceof JTextField) {
            ((JTextField) e.getSource()).selectAll();
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == dcFechainicio.getCalendarButton()) {
            dcFechainicio.setSelectableDateRange(fechaInicio, dcFechafin.getDate());
        }

        if (e.getSource() == dcFechafin.getCalendarButton()) {
            dcFechafin.setSelectableDateRange(dcFechainicio.getDate(), fechaFin);
        }

        if (e.getSource() == cboEstado) {
            if (cboEstado.getItemCount() > 0) {
                if (cboEstado.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }

        if (e.getSource() == cboIdmotivo) {
            if (cboIdmotivo.getItemCount() > 0) {
                if (cboIdmotivo.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }
    }

    @Override
    public void controlPrint(boolean view) {
        System.out.println("reporte Inicio");
        System.out.println(getPrint());
        System.out.println("reporte Fin");
        RnRegContaCab regla = new RnRegContaCab(path);
        try {
            String cod = modeltable.getGuia(table.convertRowIndexToModel(table.getSelectedRow())).getIdMovimiento();
            int cantidad = regla.verTotalDetalles(cod);
            if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
                return;
            }
            if (Constans.ISGUIAELECTRONICA) {
                //exportar txt formato digiflow
                (new FactElectTxt(this.path, cod, TipoDocVentaEnum.GUIA_REMISION_REMITENTE.getValue(), this.usuario)).exportTxt();
                return;
            }

            Reporte reportFast = new Reporte(path);
            Boolean bol = true;
            if (modeltable.getGuia(table.convertRowIndexToModel(table.getSelectedRow())).getIdTipoMov().equals("018")
                    || modeltable.getGuia(table.convertRowIndexToModel(table.getSelectedRow())).getIdTipoMov().equals("011")) {
                reportFast.generarReporte("GuiaRemisionSysEI",
                        getPrint(), "", "", "", getPrintSubreport(), "", view, false,
                        "Reporte Guías de Remisión");
            } else {
                String idTipoMov = modeltable.getGuia(table.convertRowIndexToModel(table.getSelectedRow())).getIdTipoMov();
                String idMovimiento = modeltable.getGuia(table.convertRowIndexToModel(table.getSelectedRow())).getIdMovimiento();
                logger.info("idTipoMov = " + idTipoMov);
                logger.info("idMovimiento = " + idMovimiento);
                if (idTipoMov.equals("010") || idTipoMov.equals("004") || idTipoMov.equals("012")) {
                    String proc;
                    if (idTipoMov.equals("004")) {
                        proc = "SP_LISTAR_GUIA_RPT_TRANS";
                    } else {
                        proc = "SP_LISTAR_GUIA_REPORTE";
                    }
                    String rutaJasper;
                    rutaJasper = Constans.PATH_RPT_GUIA;
                    Map parameters = new HashMap();
                    parameters.put("P_ID_TIPO_MOV", idTipoMov);
                    parameters.put(JRParameter.REPORT_LOCALE, Locale.US);
                    Exportar exportar;
                    DataSourceGuia dataSource = new DataSourceGuia();
                    RnConsultas logic = new RnConsultas(path);
                    List<BeanGuiaReporte> list = logic.listarGuiaReporte(idMovimiento, proc);
                    for (int i = 0; i < list.size(); i++) {
                        BeanGuiaReporte beanRci = list.get(i);
                        dataSource.add(beanRci);
                    }
                    exportar = new Exportar(parameters, dataSource, rutaJasper);
                    exportar.vistaPrevia(view);
                } else {
                    if (cantidad > 10) {
                        bol = false;
                        int res = JOptionPane.showConfirmDialog(this, "La guia tiene mas de 10 detalles. El formato soporta maximo 10. "
                                + "¿Desea generar el reporte?", "Informacion del Sistema", JOptionPane.OK_CANCEL_OPTION);
                        if (res == JOptionPane.OK_OPTION) {
                            bol = true;
                        }
                    }
                    if (bol) {
                        reportFast.generarReporte("GuiaRemisionSys", getPrint(), "", "", "", getPrintSubreport(), "",
                                view, false, "Reporte Guías de Remisión");
                    }
                }

            }

        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            cuadro.CuadroAviso("Error al imprimir el documento: " + ex.getMessage(), JOptionPane.ERROR_MESSAGE);
        }
    }

    @Override
    public void controlAdd() {
        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        if (registeri == null) {
            registeri = new RegisterGuiaRemision(this, "Detalle de Guia de Remisión", usuario, frame);
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
            registeri = new RegisterGuiaRemision(this, "Detalle de Guia de Remisión", usuario, frame);
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

        RnRegContaCab logicRcc = new RnRegContaCab(path);
        String idEstado = logicRcc.getIdestadoMovimiento(modeltable.getGuia(realRowIndex).getIdMovimiento());

        RnEstadoDocumento logicEstado = new RnEstadoDocumento(path);
        String descripcion = logicEstado.getDescripcion(idEstado);

        if (idEstado.equals("001")) {
            JOptionPane.showMessageDialog(frame, "La Guia de Remision ya esta " + descripcion.substring(0, 1).toUpperCase() + descripcion.substring(1, descripcion.length()).toLowerCase() + ". ", "Anular Guia de Remision", JOptionPane.INFORMATION_MESSAGE);
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        if (registeri == null) {
            registeri = new RegisterGuiaRemision(this, "Detalle de Guia de Remisión", usuario, frame);
            registeri.setPath(path);
            registeri.setRowSelection(this);
            registeri.setView(this);
            registeri.setFecha(fechaInicio, fechaFin);
            registeri.setModeRegister(Register.ANULAR);
            registeri.addInternalFrameListener(this);
            registeri.getCbo_serie().addItem(modeltable.getGuia(realRowIndex).getSerieRef());
            registeri.getCbo_serie().setSelectedIndex(0);
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
            String idMovimiento = modeltable.getGuia(realRowIndex).getIdMovimiento();
            String idMovimientoDestino = modeltable.getGuia(realRowIndex).getIdMovimientoDestino();
            String idEstado = modeltable.getGuia(realRowIndex).getIdEstado();
            if (idMovimientoDestino.trim().length() > 0) {
                int xres;
                xres = JOptionPane.showConfirmDialog(this,
                        "Seguro que desea eliminar el documento", "Sistema",
                        JOptionPane.OK_CANCEL_OPTION, JOptionPane.QUESTION_MESSAGE);
                if (xres == JOptionPane.OK_OPTION) {
                    logic.eliminarGuiaTranferencia(idMovimiento, idMovimientoDestino);
                    JOptionPane.showMessageDialog(this, "Documento eliminado correctamente");
                    cargarTabla();
                }
            } else {
                RnEstadoDocumento logicEstado = new RnEstadoDocumento(path);
                String descripcion = logicEstado.getDescripcion(idEstado);

                if (!idEstado.trim().equals("001")) {
                    JOptionPane.showMessageDialog(frame, "El documento esta en estado " + descripcion.substring(0, 1).toUpperCase() + descripcion.substring(1, descripcion.length()).toLowerCase() + ". "
                            + "\n Para que el documento pueda ser eliminado debe estar en estado Anulado.", "Eliminar Documento", JOptionPane.INFORMATION_MESSAGE);
                    return;
                }
                int xres;
                xres = JOptionPane.showConfirmDialog(this,
                        "Seguro que desea eliminar el documento", "Sistema",
                        JOptionPane.OK_CANCEL_OPTION, JOptionPane.QUESTION_MESSAGE);
                if (xres == JOptionPane.OK_OPTION) {
                    logic.eliminarMic(idMovimiento);
                    JOptionPane.showMessageDialog(this, "Documento eliminado correctamente");
                    cargarTabla();
                }
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
            registeri = new RegisterGuiaRemision(this, "Detalle de Guia de Remisión", usuario, frame);
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

    public ContaCab getGuiaSelected() {
        int visibleRowIndex = table.getSelectedRow();
        int realRowIndex = table.convertRowIndexToModel(visibleRowIndex);
        return modeltable.getGuia(realRowIndex);
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
            RnRegContaCab regla = new RnRegContaCab(path);
            modeloOrdenado.setRowFilter(null);
            modeltable.clearTable();
            modeltable.agregarListGuia(regla.listar(usuario.getCodempresa(), usuario.getCodlocalidad(),
                    "", "", "", "", DateTime.format(1901, 0, 1), "", "", "", "", "", "", "",
                    DateTime.format(1901, 0, 1), "", "", usuario.getCodpuntoventa(), fechaInicio, fechaFin));
            modeloOrdenado.setRowFilter(getFilter());
            table.setAllColumnPreferredWidth();
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txtIdmovimientoorigen && txtIdmovimientoorigen.getText().trim().length() > 0) {
            String serie = "0000000000" + txtIdmovimientoorigen.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txtIdmovimientoorigen.setText(nuevaserie);

            filtrar();
        }

        if (e.getSource() == txtIdmovimientodestino && txtIdmovimientodestino.getText().trim().length() > 0) {
            String serie = "0000000000" + txtIdmovimientodestino.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txtIdmovimientodestino.setText(nuevaserie);

            filtrar();
        }
        if (e.getSource().equals(txtGuiaSerie) || e.getSource().equals(txtDocumentoventaserie)) {
            FormatObject.formatSerie((JTextField) e.getSource());
            filtrar();
        }
        if (e.getSource() == txtGuiareimpreso && txtGuiareimpreso.getText().trim().length() > 0) {
            String serie = "0000000000" + txtGuiareimpreso.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txtGuiareimpreso.setText(nuevaserie);

            filtrar();
        }

        if (e.getSource() == txtDocumentoventaidtipodoc && txtDocumentoventaidtipodoc.getText().trim().length() > 0) {
            String serie = "00" + txtDocumentoventaidtipodoc.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 2, serie.length());

            txtDocumentoventaidtipodoc.setText(nuevaserie);

            filtrar();
        }

        if (e.getSource() == txtDocumentoventaserie && txtDocumentoventaserie.getText().trim().length() > 0) {
            String serie = "000" + txtDocumentoventaserie.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 3, serie.length());

            txtDocumentoventaserie.setText(nuevaserie);

            filtrar();
        }

        if (e.getSource() == txtDocumentoventapreimpreso && txtDocumentoventapreimpreso.getText().trim().length() > 0) {
            String serie = "0000000000" + txtDocumentoventapreimpreso.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txtDocumentoventapreimpreso.setText(nuevaserie);

            filtrar();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txtIdmovimientoorigen) {
                txtIdmovimientodestino.requestFocus();
            }

            if (e.getSource() == txtIdmovimientodestino) {
                cboIdmotivo.requestFocus();
            }

            if (e.getSource() == cboIdmotivo) {
                txtGuiaSerie.requestFocus();
            }

            if (e.getSource() == txtGuiaSerie) {
                txtGuiareimpreso.requestFocus();
            }

            if (e.getSource() == txtGuiareimpreso) {
                txtDocumentoventaidtipodoc.requestFocus();
            }

            if (e.getSource() == txtDocumentoventaidtipodoc) {
                txtDocumentoventaserie.requestFocus();
            }

            if (e.getSource() == txtDocumentoventaserie) {
                txtDocumentoventapreimpreso.requestFocus();
            }

            if (e.getSource() == txtDocumentoventapreimpreso) {
                txtTmpanexo.requestFocus();
            }

            if (e.getSource() == txtTmpanexo) {
                txtTmpruc.requestFocus();
            }

            if (e.getSource() == txtTmpruc) {
                ((JTextFieldDateEditor) dcFechainicio.getDateEditor()).requestFocus();
            }
        }
    }

    @Override
    public void propertyChange(PropertyChangeEvent evt) {
        if ((evt.getSource() == dcFechainicio)
                || (evt.getSource() == dcFechafin)) {
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
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void refreshTitleName() {
    }

    @Override
    public void controlSearch() {
    }

    @Override
    public void setSelectedRow(String clave, int column) {
    }

    @Override
    public Object getSelectedValue(String column) {
        return null;
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
}
