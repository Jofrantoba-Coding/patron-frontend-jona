package com.softcommerce.formularios;

import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.ClasifInventario;
import com.softcommerce.beans.BeanEstadoDocumento;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.TipoMovInventario;
import com.softcommerce.beans.Usuario;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import com.softcommerce.general.controles.JHInternalFrame;
import java.awt.Color;
import com.softcommerce.general.controles.Register;
import java.awt.Cursor;
import java.awt.event.ItemEvent;
import java.awt.event.KeyAdapter;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.Font;
import java.beans.PropertyChangeEvent;
import java.util.ArrayList;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.border.LineBorder;
import javax.swing.event.ListSelectionEvent;
import com.softcommerce.general.controles.CTable;
import javax.swing.RowFilter.ComparisonType;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.BorderLayout;
import javax.swing.JScrollPane;
import javax.swing.table.TableRowSorter;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.report.Reporte;
import com.softcommerce.general.controles.ControlView;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.controles.IntegerDocument;
import java.awt.event.WindowListener;
import javax.swing.event.ListSelectionListener;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.event.ActionListener;
import java.awt.event.FocusListener;
import java.awt.event.WindowEvent;
import java.awt.event.KeyListener;
import java.awt.event.ActionEvent;
import java.awt.event.FocusEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.MouseListener;
import java.beans.PropertyChangeListener;
import java.util.Date;
import java.util.List;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JDesktopPane;
import javax.swing.JOptionPane;
import javax.swing.KeyStroke;
import javax.swing.RowFilter;
import javax.swing.event.InternalFrameEvent;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.rn_ClasifInventario;
import com.softcommerce.reglasnegocio.RnEstadoDocumento;
import com.softcommerce.reglasnegocio.RnTipoMovInventario;
import com.softcommerce.general.tablas.IngresoTableModel;
import com.softcommerce.reglasnegocio.RnMovInventarioCab;
import com.softcommerce.util.ExportExcel;
import com.softcommerce.util.FormatObject;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author TOSHIBA
 */
public class PanelTFIngreso extends JHInternalFrame implements ListSelectionListener, ControlView, WindowListener, FocusListener, KeyListener, ActionListener, MouseListener, PropertyChangeListener, ItemListener {

    private static final long serialVersionUID = 1L;
    public CTable table = null;
    public IngresoTableModel modeltable;
    public TableRowSorter<IngresoTableModel> modeloOrdenado;
    public JScrollPane scroll;
    private JTextField txt_ingresoserie;
    private JTextField txt_ingresopreimpreso;
    private JTextField txt_guiaserie;
    private JTextField txt_guiapreimpreso;
    private JTextField txt_ordencompraserie;
    private JTextField txt_ordencomprapreimpreso;
    private JTextField txt_idmovimiento;
    private JTextField txt_tmpanexo;
    private JTextField txt_tmpruc;
    private List<BeanEstadoDocumento> x_idestado;
    private JComboBox cbo_idestado;
    private List<ClasifInventario> x_idclasifinventario;
    private JComboBox cbo_idclasifinventario;
    private List<TipoMovInventario> x_idtipomovinventario;
    private JComboBox cbo_idtipomovinventario;
    private List<Almacen> x_idalmacen;
    private JComboBox cbo_idalmacen;
    private Date fechaInicio;
    private Date fechaFin;
    private JDateChooser dc_fechainicio;
    private JDateChooser dc_fechafin;
    private RegisterIngreso registeri;
    private JDesktopPane jdp;
    private Usuario usuario;
    private Main frame;

    public PanelTFIngreso(String title, Main frame, JDesktopPane jdp, Usuario usuario) {
        super(title + " - PanelTFIngreso", true, false, false, true, false, true, true, true, true, true, true, true, true);
        this.usuario = usuario;
        this.frame = frame;
        this.jdp = jdp;
        inicialize();
    }

    public PanelTFIngreso(String title, Main frame, JDesktopPane jdp, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        this.jdp = jdp;
        inicialize();
    }

    public PanelTFIngreso(String title, Main frame, JDesktopPane jdp, Usuario usuario, boolean vendedor) {
        super(title + " - PanelTFIngreso", true, false, false, false, false, true, true, true, true, true, true, true, true);
        this.usuario = usuario;
        this.frame = frame;
        this.jdp = jdp;
        inicialize();
    }

    public PanelTFIngreso(String title, Main frame, JDesktopPane jdp, Usuario usuario, boolean vendedor, boolean supervisor) {
        super(title + " - PanelTFIngreso", true, false, false, true, false, true, true, true, true, true, true, true, true);
        this.usuario = usuario;
        this.frame = frame;
        this.jdp = jdp;
        inicialize();
    }

    private void inicialize() {
        modeltable = new IngresoTableModel();
        modeloOrdenado = new TableRowSorter<IngresoTableModel>(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        /*
         PopupMenuView popupmenu = new PopupMenuView();
         popupmenu.setControl(this);
         table.setComponentPopupMenu(popupmenu);
         */
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
        table.setNoVisibleColumn(26);
        table.setNoVisibleColumn(27);
        table.setNoVisibleColumn(28);
        table.setNoVisibleColumn(32);
        table.setNoVisibleColumn(33);
        table.setNoVisibleColumn(34);
        table.setNoVisibleColumn(35);
        table.setNoVisibleColumn(36);
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
        table.setNoVisibleColumn(48);
        table.setNoVisibleColumn(49);
        table.setNoVisibleColumn(52);
        table.setNoVisibleColumn(53);
        table.setNoVisibleColumn(55);
        table.setNoVisibleColumn(58);
        table.moveColumn(5, 3);
        table.moveColumn(7, 4);
        table.moveColumn(7, 5);

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

        JPanel panel = new JPanel();
        panel.setLayout(new BorderLayout());
        pnlaux.add(panel, BorderLayout.NORTH);
        panel.add(getPnlFiltro(), BorderLayout.WEST);
        /*JPanel panel = getPanelFilter();
         panel.setPreferredSize(new Dimension(1200, 120));
         pnlaux.add(panel, BorderLayout.NORTH);*/

        scroll.setPreferredSize(new Dimension(1200, 350));
        pnlaux.add(scroll, BorderLayout.CENTER);
        //JPanel pnltest = getPanelFilter();

        setTable(pnlaux);
    }

    private JPanel getPnlFiltro() {
        JPanel pnlp = new JPanel();
        pnlp.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;

        JLabel lblCodigoDespacho = new JLabel("Codigo");
        //lblCodigoDespacho.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lblCodigoDespacho, gbc);

        gbc.gridx = 1;
        txt_idmovimiento = new JTextField();
        //txt_idmovimiento.setBounds(40, 15, 90, 20);
        txt_idmovimiento.addKeyListener(this);
        txt_idmovimiento.setColumns(10);
        txt_idmovimiento.addFocusListener(this);
        txt_idmovimiento.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnlp.add(txt_idmovimiento, gbc);

        gbc.gridx = 2;
        JLabel lblSerie = new JLabel("N° Ingreso");
        pnlp.add(lblSerie, gbc);

        gbc.gridx = 3;
        gbc.insets = new Insets(2, 2, 2, 0);
        txt_ingresoserie = new JTextField();
        txt_ingresoserie.addKeyListener(this);
        txt_ingresoserie.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_ingresoserie.addFocusListener(this);
        FormatObject.formatJTextFieldSerie(txt_ingresoserie);
        txt_ingresoserie.setForeground(Color.BLACK);
        txt_ingresoserie.setColumns(3);
        pnlp.add(txt_ingresoserie, gbc);

        gbc.gridx = 4;
        gbc.insets = new Insets(2, 0, 2, 2);
        txt_ingresopreimpreso = new JTextField();
        txt_ingresopreimpreso.addKeyListener(this);
        txt_ingresopreimpreso.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_ingresopreimpreso.addFocusListener(this);
        txt_ingresopreimpreso.setDocument(new IntegerDocument(10));
        txt_ingresopreimpreso.setForeground(Color.BLACK);
        txt_ingresopreimpreso.setColumns(10);
        pnlp.add(txt_ingresopreimpreso);

        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.gridx = 5;
        JLabel lblSerieGuiaRef = new JLabel("N° Guia Ref");
        pnlp.add(lblSerieGuiaRef, gbc);

        gbc.insets = new Insets(2, 2, 2, 0);
        gbc.gridx = 6;
        txt_guiaserie = new JTextField();
        txt_guiaserie.addKeyListener(this);
        txt_guiaserie.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_guiaserie.addFocusListener(this);
        FormatObject.formatJTextFieldSerie(txt_guiaserie);
        txt_guiaserie.setForeground(Color.BLACK);
        txt_guiaserie.setColumns(3);
        pnlp.add(txt_guiaserie, gbc);

        gbc.insets = new Insets(2, 0, 2, 2);
        gbc.gridx = 7;
        txt_guiapreimpreso = new JTextField();
        txt_guiapreimpreso.setColumns(10);
        txt_guiapreimpreso.addKeyListener(this);
        txt_guiapreimpreso.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_guiapreimpreso.addFocusListener(this);
        txt_guiapreimpreso.setDocument(new IntegerDocument(10));
        txt_guiapreimpreso.setForeground(Color.BLACK);
        pnlp.add(txt_guiapreimpreso, gbc);

        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.gridx = 8;
        JLabel lblSerieDocVentaRef = new JLabel("N° OC Ref");
        pnlp.add(lblSerieDocVentaRef, gbc);

        gbc.insets = new Insets(2, 2, 2, 0);
        gbc.gridx = 9;
        txt_ordencompraserie = new JTextField();
        txt_ordencompraserie.setColumns(3);
        txt_ordencompraserie.addKeyListener(this);
        txt_ordencompraserie.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_ordencompraserie.addFocusListener(this);
        FormatObject.formatJTextFieldSerie(txt_ordencompraserie);
        txt_ordencompraserie.setForeground(Color.BLACK);
        pnlp.add(txt_ordencompraserie, gbc);

        gbc.insets = new Insets(2, 0, 2, 2);
        gbc.gridx = 10;
        txt_ordencomprapreimpreso = new JTextField();
        txt_ordencomprapreimpreso.setColumns(10);
        txt_ordencomprapreimpreso.addKeyListener(this);
        txt_ordencomprapreimpreso.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_ordencomprapreimpreso.addFocusListener(this);
        txt_ordencomprapreimpreso.setDocument(new IntegerDocument(10));
        txt_ordencomprapreimpreso.setForeground(Color.BLACK);
        pnlp.add(txt_ordencomprapreimpreso, gbc);

        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.gridx = 11;
        JLabel lbl_familia = new JLabel("Est");
        lbl_familia.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lbl_familia, gbc);

        gbc.gridx = 12;
        cbo_idestado = new JComboBox();
        cbo_idestado.addActionListener(this);
        cbo_idestado.addKeyListener(this);
        pnlp.add(cbo_idestado, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblRazonSocial = new JLabel("R Social");
        pnlp.add(lblRazonSocial, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 4;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        txt_tmpanexo = new JTextField();
        //txt_tmpanexo.setBounds(55, 45, 350, 20);
        txt_tmpanexo.addKeyListener(this);
        txt_tmpanexo.setDocument(new UpperCaseNumberDocument(250));
        txt_tmpanexo.addFocusListener(this);
        pnlp.add(txt_tmpanexo, gbc);
        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.NONE;

        gbc.gridx = 5;
        JLabel lbl_RucCliente = new JLabel("RUC/DNI");
        pnlp.add(lbl_RucCliente, gbc);

        gbc.gridwidth = 2;
        gbc.gridx = 6;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        txt_tmpruc = new JTextField();
        txt_tmpruc.setBounds(470, 45, 80, 20);
        txt_tmpruc.addFocusListener(this);
        txt_tmpruc.addKeyListener(this);
        pnlp.add(txt_tmpruc, gbc);

        gbc.gridwidth = 1;
        gbc.gridx = 8;
        gbc.fill = GridBagConstraints.NONE;

        JLabel lblFechaInicio = new JLabel("F Inicio");
        lblFechaInicio.setDisplayedMnemonic('c');
        pnlp.add(lblFechaInicio, gbc);

        gbc.gridx = 9;
        gbc.gridwidth = 2;
        dc_fechainicio = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextField) dc_fechainicio.getDateEditor()).addFocusListener(this);
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
        pnlp.add(dc_fechainicio, gbc);

        gbc.gridx = 11;
        gbc.gridwidth = 1;
        JLabel lblFechaFin = new JLabel("F Fin");
        lblFechaFin.setDisplayedMnemonic('a');
        pnlp.add(lblFechaFin, gbc);

        gbc.gridx = 12;
        dc_fechafin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextField) dc_fechafin.getDateEditor()).addFocusListener(this);
        dc_fechafin.setBounds(740, 45, 90, 20);
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
                cbo_idclasifinventario.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dc_fechafin.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_fechafin.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        pnlp.add(dc_fechafin, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;

        JLabel lbl_idclasifinventario = new JLabel("Clasif Inventario");
        lbl_idclasifinventario.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lbl_idclasifinventario, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 3;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        cbo_idclasifinventario = new JComboBox();
        cbo_idclasifinventario.setBounds(110, 75, 180, 20);
        cbo_idclasifinventario.setFont(new Font(Font.SANS_SERIF, 0, 9));
        cbo_idclasifinventario.addActionListener(this);
        cbo_idclasifinventario.addKeyListener(this);
        pnlp.add(cbo_idclasifinventario, gbc);

        gbc.gridx = 4;
        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.NONE;
        JLabel lbl_idtipomovinventario = new JLabel("T Mov");
        lbl_idtipomovinventario.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lbl_idtipomovinventario, gbc);

        gbc.gridx = 5;
        gbc.gridwidth = 3;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        cbo_idtipomovinventario = new JComboBox();
        cbo_idtipomovinventario.setFont(new Font(Font.SANS_SERIF, 0, 9));
        cbo_idtipomovinventario.addActionListener(this);
        cbo_idtipomovinventario.addKeyListener(this);
        pnlp.add(cbo_idtipomovinventario, gbc);

        gbc.gridx = 8;
        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.NONE;
        JLabel lbl_idalmacen = new JLabel("Almacen");
        lbl_idalmacen.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lbl_idalmacen, gbc);

        gbc.gridx = 9;
        gbc.gridwidth = 4;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        cbo_idalmacen = new JComboBox();
        cbo_idalmacen.setFont(new Font(Font.SANS_SERIF, 0, 9));
        cbo_idalmacen.addActionListener(this);
        cbo_idalmacen.addKeyListener(this);
        pnlp.add(cbo_idalmacen, gbc);

        return pnlp;
    }

    private JPanel getPanelFilter() {
        //JPanel pnlPrinc = new JPanel();
        //pnlPrinc.setLayout(new BorderLayout());
        JPanel pnlp = new JPanel();
        pnlp.setBorder(new LineBorder(new Color(130, 135, 144)));
        //pnlp.setLayout(new GridBagLayout());
        pnlp.setLayout(null);
        //pnlPrinc.add(pnlp, BorderLayout.WEST);

        JLabel lblCodigoDespacho = new JLabel("Cod");
        lblCodigoDespacho.setBounds(10, 15, 25, 20);
        lblCodigoDespacho.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lblCodigoDespacho);

        txt_idmovimiento = new JTextField();
        txt_idmovimiento.setBounds(40, 15, 90, 20);
        txt_idmovimiento.addKeyListener(this);
        txt_idmovimiento.addFocusListener(this);
        txt_idmovimiento.setFont(new Font("Garamond", 0, 14));
        pnlp.add(txt_idmovimiento);

        JLabel lblSerie = new JLabel("N° Ingreso");
        lblSerie.setBounds(145, 15, 60, 20);
        pnlp.add(lblSerie);

        txt_ingresoserie = new JTextField();
        txt_ingresoserie.setBounds(205, 15, 30, 20);
        txt_ingresoserie.addKeyListener(this);
        txt_ingresoserie.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_ingresoserie.addFocusListener(this);
        txt_ingresoserie.setDocument(new IntegerDocument(3));
        txt_ingresoserie.setForeground(Color.BLACK);
        pnlp.add(txt_ingresoserie);

        txt_ingresopreimpreso = new JTextField();
        txt_ingresopreimpreso.setBounds(240, 15, 80, 20);
        txt_ingresopreimpreso.addKeyListener(this);
        txt_ingresopreimpreso.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_ingresopreimpreso.addFocusListener(this);
        txt_ingresopreimpreso.setDocument(new IntegerDocument(10));
        txt_ingresopreimpreso.setForeground(Color.BLACK);
        pnlp.add(txt_ingresopreimpreso);

        JLabel lblSerieGuiaRef = new JLabel("N° Guia Ref");
        lblSerieGuiaRef.setBounds(335, 15, 65, 20);
        pnlp.add(lblSerieGuiaRef);

        txt_guiaserie = new JTextField();
        txt_guiaserie.setBounds(400, 15, 30, 20);
        txt_guiaserie.addKeyListener(this);
        txt_guiaserie.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_guiaserie.addFocusListener(this);
        txt_guiaserie.setDocument(new IntegerDocument(3));
        txt_guiaserie.setForeground(Color.BLACK);
        pnlp.add(txt_guiaserie);

        txt_guiapreimpreso = new JTextField();
        txt_guiapreimpreso.setBounds(435, 15, 80, 20);
        txt_guiapreimpreso.addKeyListener(this);
        txt_guiapreimpreso.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_guiapreimpreso.addFocusListener(this);
        txt_guiapreimpreso.setDocument(new IntegerDocument(10));
        txt_guiapreimpreso.setForeground(Color.BLACK);
        pnlp.add(txt_guiapreimpreso);

        JLabel lblSerieDocVentaRef = new JLabel("N° OC Ref");
        lblSerieDocVentaRef.setBounds(530, 15, 60, 20);
        pnlp.add(lblSerieDocVentaRef);

        txt_ordencompraserie = new JTextField();
        txt_ordencompraserie.setBounds(590, 15, 30, 20);
        txt_ordencompraserie.addKeyListener(this);
        txt_ordencompraserie.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_ordencompraserie.addFocusListener(this);
        txt_ordencompraserie.setDocument(new IntegerDocument(3));
        txt_ordencompraserie.setForeground(Color.BLACK);
        pnlp.add(txt_ordencompraserie);

        txt_ordencomprapreimpreso = new JTextField();
        txt_ordencomprapreimpreso.setBounds(625, 15, 80, 20);
        txt_ordencomprapreimpreso.addKeyListener(this);
        txt_ordencomprapreimpreso.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_ordencomprapreimpreso.addFocusListener(this);
        txt_ordencomprapreimpreso.setDocument(new IntegerDocument(10));
        txt_ordencomprapreimpreso.setForeground(Color.BLACK);
        pnlp.add(txt_ordencomprapreimpreso);

        JLabel lbl_familia = new JLabel("Est");
        lbl_familia.setFont(new Font("Verdana", 0, 11));
        lbl_familia.setBounds(720, 15, 25, 20);
        pnlp.add(lbl_familia);

        cbo_idestado = new JComboBox();
        cbo_idestado.setBounds(745, 15, 50, 20);
        cbo_idestado.addActionListener(this);
        cbo_idestado.addKeyListener(this);
        pnlp.add(cbo_idestado);

        JLabel lblRazonSocial = new JLabel("R Social");
        lblRazonSocial.setBounds(10, 45, 45, 20);
        pnlp.add(lblRazonSocial);

        txt_tmpanexo = new JTextField();
        txt_tmpanexo.setBounds(55, 45, 350, 20);
        txt_tmpanexo.addKeyListener(this);
        txt_tmpanexo.setDocument(new UpperCaseNumberDocument(250));
        txt_tmpanexo.addFocusListener(this);
        pnlp.add(txt_tmpanexo);

        JLabel lbl_RucCliente = new JLabel("RUC/DNI");
        lbl_RucCliente.setBounds(420, 45, 50, 20);
        pnlp.add(lbl_RucCliente);

        txt_tmpruc = new JTextField();
        txt_tmpruc.setBounds(470, 45, 80, 20);
        txt_tmpruc.addFocusListener(this);
        txt_tmpruc.addKeyListener(this);
        pnlp.add(txt_tmpruc);

        JLabel lblFechaInicio = new JLabel("F Inicio");
        lblFechaInicio.setDisplayedMnemonic('c');
        lblFechaInicio.setBounds(565, 45, 45, 20);
        pnlp.add(lblFechaInicio);

        dc_fechainicio = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextField) dc_fechainicio.getDateEditor()).addFocusListener(this);
        dc_fechainicio.setBounds(610, 45, 90, 20);
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

        JLabel lblFechaFin = new JLabel("F Fin");
        lblFechaFin.setBounds(710, 45, 30, 20);
        lblFechaFin.setDisplayedMnemonic('a');
        pnlp.add(lblFechaFin);

        dc_fechafin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextField) dc_fechafin.getDateEditor()).addFocusListener(this);
        dc_fechafin.setBounds(740, 45, 90, 20);
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
                cbo_idclasifinventario.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dc_fechafin.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_fechafin.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        pnlp.add(dc_fechafin);

        JLabel lbl_idclasifinventario = new JLabel("Clasif Inventario");
        lbl_idclasifinventario.setFont(new Font("Verdana", 0, 11));
        lbl_idclasifinventario.setBounds(10, 75, 100, 20);
        pnlp.add(lbl_idclasifinventario);

        cbo_idclasifinventario = new JComboBox();
        cbo_idclasifinventario.setBounds(110, 75, 180, 20);
        cbo_idclasifinventario.setFont(new Font(Font.SANS_SERIF, 0, 9));
        cbo_idclasifinventario.addActionListener(this);
        cbo_idclasifinventario.addKeyListener(this);
        pnlp.add(cbo_idclasifinventario);

        JLabel lbl_idtipomovinventario = new JLabel("T Mov");
        lbl_idtipomovinventario.setFont(new Font("Verdana", 0, 11));
        lbl_idtipomovinventario.setBounds(305, 75, 40, 20);
        pnlp.add(lbl_idtipomovinventario);

        cbo_idtipomovinventario = new JComboBox();
        cbo_idtipomovinventario.setBounds(345, 75, 250, 20);
        cbo_idtipomovinventario.setFont(new Font(Font.SANS_SERIF, 0, 9));
        cbo_idtipomovinventario.addActionListener(this);
        cbo_idtipomovinventario.addKeyListener(this);
        pnlp.add(cbo_idtipomovinventario);

        JLabel lbl_idalmacen = new JLabel("Almacen");
        lbl_idalmacen.setFont(new Font("Verdana", 0, 11));
        lbl_idalmacen.setBounds(610, 75, 50, 20);
        pnlp.add(lbl_idalmacen);

        cbo_idalmacen = new JComboBox();
        cbo_idalmacen.setBounds(660, 75, 150, 20);
        cbo_idalmacen.setFont(new Font(Font.SANS_SERIF, 0, 9));
        cbo_idalmacen.addActionListener(this);
        cbo_idalmacen.addKeyListener(this);
        pnlp.add(cbo_idalmacen);

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
        parameters.put(2, "Ingreso");
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
                    || (e.getSource() == txt_ingresoserie)
                    || (e.getSource() == txt_ingresopreimpreso)
                    || (e.getSource() == txt_ordencompraserie)
                    || (e.getSource() == txt_ordencomprapreimpreso)
                    || (e.getSource() == txt_guiaserie)
                    || (e.getSource() == txt_guiapreimpreso)) {
                filtrar();
            }
        }
    }

    public RowFilter<Object, Object> getFilter() {
        List<RowFilter<Object, Object>> filters = new ArrayList<RowFilter<Object, Object>>();

        if (cbo_idestado.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + x_idestado.get(cbo_idestado.getSelectedIndex() - 1).getIdEstado() + ".*", 48));
        }

        if (cbo_idclasifinventario.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + x_idclasifinventario.get(cbo_idclasifinventario.getSelectedIndex() - 1).getid_clasif_inventario() + ".*", 58));
        }

        if (cbo_idalmacen.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + x_idalmacen.get(cbo_idalmacen.getSelectedIndex() - 1).getIdAlmacen() + ".*", 10));
        }

        if (cbo_idtipomovinventario.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + x_idtipomovinventario.get(cbo_idtipomovinventario.getSelectedIndex() - 1).getIdTipoMov() + ".*", 3));
        }

        if (txt_idmovimiento.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_idmovimiento.getText().trim() + ".*", 1));
        }

        if (txt_tmpruc.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_tmpruc.getText().trim() + ".*", 31));
        }

        if (txt_tmpanexo.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_tmpanexo.getText().trim() + ".*", 30));
        }

        if (txt_ingresoserie.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_ingresoserie.getText().trim() + ".*", 14));
        }

        if (txt_ingresopreimpreso.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_ingresopreimpreso.getText().trim() + ".*", 15));
        }

        if (txt_guiaserie.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_guiaserie.getText().trim() + ".*", 18));
        }

        if (txt_guiapreimpreso.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_guiapreimpreso.getText().trim() + ".*", 19));
        }

        if (txt_ordencompraserie.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_ordencompraserie.getText().trim() + ".*", 42));
        }

        if (txt_ordencomprapreimpreso.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_ordencomprapreimpreso.getText().trim() + ".*", 43));
        }

        if (!((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText().equals("__/__/____")
                && !((JTextFieldDateEditor) dc_fechafin.getDateEditor()).getText().equals("__/__/____")) {
            if (DateTime.isValidDate(((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText())
                    && DateTime.isValidDate(((JTextFieldDateEditor) dc_fechafin.getDateEditor()).getText())) {
                filters.add(RowFilter.dateFilter(ComparisonType.AFTER, DateTime.getDateMinusOrPlus(dc_fechainicio.getDate(), -1), 29));
                filters.add(RowFilter.dateFilter(ComparisonType.BEFORE, DateTime.getDateMinusOrPlus(dc_fechafin.getDate(), 1), 29));
            }
        }

        RowFilter<Object, Object> fooBarFilter = RowFilter.andFilter(filters);

        return fooBarFilter;
    }

    public void cargarFiltro() {
        loadEstadoDocumento();
        loadClasifInventario();
        loadAlmacen();
    }

    public void loadAlmacen() {
        try {
            RnAlmacen regla_Familia = new RnAlmacen(path);

            if (x_idalmacen != null) {
                x_idalmacen.clear();
            } else {
                x_idalmacen = new ArrayList<Almacen>();
            }

            x_idalmacen.addAll(regla_Familia.listar("", "", usuario.getCodpuntoventa()));

            cbo_idalmacen.removeAllItems();
            cbo_idalmacen.addItem("--- TODOS ---");

            for (Integer i = 0; i < x_idalmacen.size(); i++) {
                cbo_idalmacen.addItem(x_idalmacen.get(i).getDescripcion());
            }

            cbo_idalmacen.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadEstadoDocumento() {
        RnEstadoDocumento regla_Familia = new RnEstadoDocumento(path);

        if (x_idestado != null) {
            x_idestado.clear();
        } else {
            x_idestado = new ArrayList<BeanEstadoDocumento>();
        }

        x_idestado.addAll(regla_Familia.listarGeneral());

        cbo_idestado.removeAllItems();
        cbo_idestado.addItem("T");

        for (Integer i = 0; i < x_idestado.size(); i++) {
            cbo_idestado.addItem(x_idestado.get(i).getAbreviatura());
        }

        cbo_idestado.setSelectedIndex(0);
    }

    public void loadClasifInventario() {
        rn_ClasifInventario regla_Familia = new rn_ClasifInventario(path);

        if (x_idclasifinventario != null) {
            x_idclasifinventario.clear();
        } else {
            x_idclasifinventario = new ArrayList<ClasifInventario>();
        }

        x_idclasifinventario.addAll(regla_Familia.listar("", "", "", "E"));

        cbo_idclasifinventario.removeAllItems();
        cbo_idclasifinventario.addItem("--- TODOS ---");

        for (Integer i = 0; i < x_idclasifinventario.size(); i++) {
            cbo_idclasifinventario.addItem(x_idclasifinventario.get(i).getDescripcion());
        }

        cbo_idclasifinventario.setSelectedIndex(0);
    }

    public void loadTipoMovInventario(String idclasifinventario) {
        try {
            RnTipoMovInventario regla_Familia = new RnTipoMovInventario(path);

            if (x_idtipomovinventario != null) {
                x_idtipomovinventario.clear();
            } else {
                x_idtipomovinventario = new ArrayList<TipoMovInventario>();
            }

            TipoMovInventario t = new TipoMovInventario();
            t.setIdClasifInventario(idclasifinventario);

            x_idtipomovinventario.addAll(regla_Familia.listar(t));

            cbo_idtipomovinventario.removeAllItems();
            cbo_idtipomovinventario.addItem("--- TODOS ---");

            for (int i = 0; i < x_idtipomovinventario.size(); i++) {
                cbo_idtipomovinventario.addItem(x_idtipomovinventario.get(i).getDescripcion());
            }

            cbo_idtipomovinventario.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == (JTextField) dc_fechainicio.getDateEditor()) {
            ((JTextField) dc_fechainicio.getDateEditor()).selectAll();
        }

        if (e.getSource() == (JTextField) dc_fechafin.getDateEditor()) {
            ((JTextField) dc_fechafin.getDateEditor()).selectAll();
        }

        if (e.getSource() == txt_idmovimiento) {
            txt_idmovimiento.selectAll();
        }

        if (e.getSource() == txt_tmpanexo) {
            txt_tmpanexo.selectAll();
        }

        if (e.getSource() == txt_tmpruc) {
            txt_tmpruc.selectAll();
        }

        if (e.getSource() == txt_guiaserie) {
            txt_guiaserie.selectAll();
        }

        if (e.getSource() == txt_guiapreimpreso) {
            txt_guiapreimpreso.selectAll();
        }

        if (e.getSource() == txt_ordencompraserie) {
            txt_ordencompraserie.selectAll();
        }

        if (e.getSource() == txt_ordencomprapreimpreso) {
            txt_ordencomprapreimpreso.selectAll();
        }

        if (e.getSource() == txt_ingresoserie) {
            txt_ingresoserie.selectAll();
        }

        if (e.getSource() == txt_ingresopreimpreso) {
            txt_ingresopreimpreso.selectAll();
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == dc_fechainicio.getCalendarButton()) {
            dc_fechainicio.setSelectableDateRange(fechaInicio, dc_fechafin.getDate());
        }

        if (e.getSource() == dc_fechafin.getCalendarButton()) {
            dc_fechafin.setSelectableDateRange(dc_fechainicio.getDate(), fechaFin);
        }

        if (cbo_idclasifinventario == e.getSource()) {
            if (cbo_idclasifinventario.getItemCount() > 0) {
                if (cbo_idclasifinventario.getSelectedIndex() >= 0) {
                    if (cbo_idclasifinventario.getSelectedIndex() == 0) {
                        cbo_idtipomovinventario.removeAllItems();
                        cbo_idtipomovinventario.setEnabled(false);
                    } else {
                        cbo_idtipomovinventario.setEnabled(true);
                        loadTipoMovInventario(x_idclasifinventario.get(cbo_idclasifinventario.getSelectedIndex() - 1).getid_clasif_inventario());
                    }

                    filtrar();
                }
            }
        }

        if (e.getSource() == cbo_idtipomovinventario) {
            if (cbo_idtipomovinventario.getItemCount() > 0) {
                if (cbo_idtipomovinventario.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }

        if (e.getSource() == cbo_idestado) {
            if (cbo_idestado.getItemCount() > 0) {
                if (cbo_idestado.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }

        if (e.getSource() == cbo_idalmacen) {
            if (cbo_idalmacen.getItemCount() > 0) {
                if (cbo_idalmacen.getSelectedIndex() >= 0) {
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
            reportFast.generarReporte("Ingreso", getSelectedValue(1), "", "", "", "", "", view, false,
                    "Reporte Notas de Ingreso");
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, ex.toString());
        }
    }

    @Override
    public void controlAdd() {
        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        if (registeri == null) {
            registeri = new RegisterIngreso(this, "Detalle de Ingreso", usuario, frame);
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
            registeri = new RegisterIngreso(this, "Detalle de Ingreso", usuario, frame);
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

        ContaCab bean = modeltable.getIngreso(realRowIndex);

        /*rn_RegContaCab regla_1 = new rn_RegContaCab(path);
         String id_estado = regla_1.getIdestadoMovimiento(modeltable.getIngreso(realRowIndex).getId_movimiento());

         rn_EstadoDocumento regla_2 = new rn_EstadoDocumento(path);
         String descripcion = regla_2.getDescripcion(id_estado);

         if (id_estado.trim().equals("001")) {
         JOptionPane.showMessageDialog(frame, "El documento ya esta " + descripcion.substring(0, 1).toUpperCase() + descripcion.substring(1, descripcion.length()).toLowerCase() + ". ", "Anular Documento", JOptionPane.INFORMATION_MESSAGE);
         return;
         }*/
        if (bean.getIdEstado().trim().equals("001")) {
            JOptionPane.showMessageDialog(frame, "El documento ya esta " + bean.getEstado().substring(0, 1).toUpperCase() + bean.getEstado().substring(1, bean.getEstado().length()).toLowerCase() + ". ", "Anular Documento", JOptionPane.INFORMATION_MESSAGE);
            return;
        }
        if (bean.getIdTipoMov().trim().equals("013")) {
            JOptionPane.showMessageDialog(frame, "Anule este Documento por Modulo Web", "Anular Documento", JOptionPane.INFORMATION_MESSAGE);
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        if (registeri == null) {
            registeri = new RegisterIngreso(this, "Detalle de Ingreso", usuario, frame);
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
            String id_movimiento = modeltable.getIngreso(realRowIndex).getIdMovimiento();
            String id_estado = modeltable.getIngreso(realRowIndex).getIdEstado();
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
            registeri = new RegisterIngreso(this, "Detalle de Ingreso", usuario, frame);
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
        /*if (row >= 0) {
            table.setRowSelectionInterval(row, row);
            setScrollValueView(row);
        }*/
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
        ContaCab m = new ContaCab();
        m.setTipo("E");
        m.setFInicial(fechaInicio);
        m.setFFinal(fechaFin);
        m.setIdTipoDoc("NI");
        m.setIdEmpresa(usuario.getCodempresa());
        m.setIdPuntoventa(usuario.getCodpuntoventa());

        RnRegContaCab regla = new RnRegContaCab(path);
        modeloOrdenado.setRowFilter(null);
        modeltable.clearTable();
        modeltable.agregarVectoringreso(regla.listarOrdenRecojo(m));
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

        if (e.getSource() == txt_ingresoserie && txt_ingresoserie.getText().trim().length() > 0) {
            String serie = "000" + txt_ingresoserie.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 3, serie.length());

            txt_ingresoserie.setText(nuevaserie);

            filtrar();
        }

        if (e.getSource() == txt_ingresopreimpreso && txt_ingresopreimpreso.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_ingresopreimpreso.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txt_ingresopreimpreso.setText(nuevaserie);

            filtrar();
        }

        if (e.getSource() == txt_ordencompraserie && txt_ordencompraserie.getText().trim().length() > 0) {
            String serie = "000" + txt_ordencompraserie.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 3, serie.length());

            txt_ordencompraserie.setText(nuevaserie);

            filtrar();
        }

        if (e.getSource() == txt_ordencomprapreimpreso && txt_ordencomprapreimpreso.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_ordencomprapreimpreso.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txt_ordencomprapreimpreso.setText(nuevaserie);

            filtrar();
        }

        if (e.getSource() == txt_guiaserie && txt_guiaserie.getText().trim().length() > 0) {
            String serie = "000" + txt_guiaserie.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 3, serie.length());

            txt_guiaserie.setText(nuevaserie);

            filtrar();
        }

        if (e.getSource() == txt_guiapreimpreso && txt_guiapreimpreso.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_guiapreimpreso.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txt_guiapreimpreso.setText(nuevaserie);

            filtrar();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txt_idmovimiento) {
                txt_ingresoserie.requestFocus();
            }

            if (e.getSource() == txt_ingresoserie) {
                txt_ingresopreimpreso.requestFocus();
            }

            if (e.getSource() == txt_ingresopreimpreso) {
                txt_guiaserie.requestFocus();
            }

            if (e.getSource() == txt_guiaserie) {
                txt_guiapreimpreso.requestFocus();
            }

            if (e.getSource() == txt_guiapreimpreso) {
                txt_ordencompraserie.requestFocus();
            }

            if (e.getSource() == txt_ordencompraserie) {
                txt_ordencomprapreimpreso.requestFocus();
            }

            if (e.getSource() == txt_ordencomprapreimpreso) {
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

            if (e.getSource() == cbo_idclasifinventario) {
                if (cbo_idtipomovinventario.isEnabled()) {
                    cbo_idtipomovinventario.requestFocus();
                } else {
                    cbo_idalmacen.requestFocus();
                }
            }

            if (e.getSource() == cbo_idtipomovinventario) {
                cbo_idalmacen.requestFocus();
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
