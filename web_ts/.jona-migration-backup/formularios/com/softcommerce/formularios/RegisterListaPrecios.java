package com.softcommerce.formularios;

import com.softcommerce.beans.BeanColor;
import com.softcommerce.beans.BeanFamilia;
import com.softcommerce.beans.BeanSubFamilia;
import com.softcommerce.beans.Item;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.BeanMarca;
import com.softcommerce.beans.PreciosItem;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.BeanTamano;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioAUD;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.CuadroMensaje;
import com.softcommerce.general.controles.DigitTextFieldCellEditor;
import com.softcommerce.general.controles.EnumClass;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.ObjectItem;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.PreciosItemTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnColor;
import com.softcommerce.reglasnegocio.RnFamilia;
import com.softcommerce.reglasnegocio.RnLocalidad;
import com.softcommerce.reglasnegocio.RnMarca;
import com.softcommerce.reglasnegocio.RnPreciosCab;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnSubFamilia;
import com.softcommerce.reglasnegocio.RnTamano;
import com.softcommerce.util.render.CellRenderer;
import com.softcommerce.util.ColumnGroup;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.Exportar;
import com.softcommerce.util.GroupableTableHeaderLabel;
import com.softcommerce.util.LayoutUtil;
import com.softcommerce.util.combo.LoadComboItem;
import com.softcommerce.util.render.CellRendererEditListaPrecio;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.beans.PropertyVetoException;
import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.swing.BorderFactory;
import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JInternalFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JRadioButton;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.ListSelectionModel;
import javax.swing.SwingConstants;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import javax.swing.table.TableColumnModel;
import org.apache.log4j.Logger;
import java.net.URL;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import javax.swing.border.EmptyBorder;
import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.JRParameter;

public class RegisterListaPrecios
        extends JInternalFrame
        implements KeyListener, ActionListener, MouseListener, FocusListener {

    private PreciosItemTableModel modelTblCierre;
    private CTable tblCierre;
    private Usuario usuario = new Usuario();
    private List<BeanFamilia> xFamilia;
    private JComboBox cboFamilia;
    private List<BeanSubFamilia> xSubFamilia;
    private JComboBox cboSubFamilia;
    private List<BeanMarca> xMarca;
    private JComboBox cboMarca;
    private List<PuntoVenta> xPuntoVenta;
    private JComboBox cboPuntoVenta;
    private List<BeanColor> xColor;
    private JComboBox cboGrupo;
    private List<BeanTamano> xTamano;
    private JComboBox cboTamano;
    private List<Localidad> xLocalidad;
    private JComboBox cboLocalidad;
    private JTextField txtDescripcion;
    private JTextField txtIdItem;
    private JTextField txtIdAlterno;
    private JTextField txtCodigo;
    private JTextField txtItemDescripcion;
    private JButton btnBuscar;
    private JButton btnGuardar;
    private JButton btnExportar;
    private JButton btnPdf;
    private final CuadroMensaje cuadro;
    private final URL path;
    private ButtonGroup grupoOpcion;
    private JRadioButton rdDolar;
    private JRadioButton rdSoles;
    private final Logger logger = Logger.getLogger(RegisterListaPrecios.class);
    private Gif gif;
    private JComboBox cboClaseOperacion;

    public RegisterListaPrecios(String title, Usuario usuario, URL path) {
        super(title);
        this.path = path;
        this.usuario = usuario;
        inicialize();
        cuadro = new CuadroMensaje(usuario);
    }

    private void inicialize() {
        gif = new Gif();

        JPanel pnlPrincipal = new JPanel();
        pnlPrincipal.setLayout(new BorderLayout());
        pnlPrincipal.setBorder(new EmptyBorder(10, 10, 10, 10));

        pnlPrincipal.add(this.getPnlFiltro(), BorderLayout.NORTH);
        pnlPrincipal.add(this.getCenter(), BorderLayout.CENTER);
        pnlPrincipal.add(this.getPnlSouth(), BorderLayout.SOUTH);

        getContentPane().add(pnlPrincipal);

        setMaximizable(false);
        setResizable(false);
        setClosable(true);
        setSize(1020, 438);
        setIconifiable(true);
        setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2), (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);

        this.initListener();
    }

    private void loadClaseOperacion() throws Exception {
        try {
            cboClaseOperacion.addItem(new ObjectItem("--- TODOS ---", ""));
            cboClaseOperacion.addItem(new ObjectItem("VENTAS", "002"));
            cboClaseOperacion.addItem(new ObjectItem("COMPRAS", "001"));
            cboClaseOperacion.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    private void initListener() {
        addKeyListener(this);
        rdDolar.addActionListener(actionListener);
        rdSoles.addActionListener(actionListener);
        cboLocalidad.addActionListener(this);
        cboLocalidad.addKeyListener(this);
        cboPuntoVenta.addActionListener(this);
        cboPuntoVenta.addKeyListener(this);
        txtIdItem.addFocusListener(this);
        txtIdItem.addKeyListener(this);
        txtIdAlterno.addFocusListener(this);
        txtIdAlterno.addKeyListener(this);
        txtDescripcion.addKeyListener(this);
        txtDescripcion.addFocusListener(this);
        cboFamilia.addActionListener(this);
        cboFamilia.addKeyListener(this);
        cboSubFamilia.addActionListener(this);
        cboSubFamilia.addKeyListener(this);
        cboMarca.addKeyListener(this);
        cboMarca.addActionListener(this);
        cboGrupo.addKeyListener(this);
        cboTamano.addKeyListener(this);
        btnBuscar.addActionListener(this);
        btnBuscar.addKeyListener(this);
        btnGuardar.addActionListener(this);
        btnExportar.addActionListener(this);
        btnPdf.addActionListener(this);
    }

    private JScrollPane getCenter() {
        modelTblCierre = new PreciosItemTableModel();
        tblCierre = new CTable();
        tblCierre.setModel(modelTblCierre);
        tblCierre.addMouseListener(this);
        tblCierre.addFocusListener(this);
        tblCierre.addKeyListener(this);
        tblCierre.setAllTableNoEditable();
        tblCierre.getColumnModel().getColumn(2).setCellEditor(new DigitTextFieldCellEditor(EnumClass.TipoDatoEditor.DOUBLE_EDITOR).cellEditor);
        tblCierre.getColumnModel().getColumn(3).setCellEditor(new DigitTextFieldCellEditor(EnumClass.TipoDatoEditor.DOUBLE_EDITOR).cellEditor);
        tblCierre.getColumnModel().getColumn(4).setCellEditor(new DigitTextFieldCellEditor(EnumClass.TipoDatoEditor.DOUBLE_EDITOR).cellEditor);
        tblCierre.getColumnModel().getColumn(5).setCellEditor(new DigitTextFieldCellEditor(EnumClass.TipoDatoEditor.DOUBLE_EDITOR).cellEditor);
        tblCierre.getColumnModel().getColumn(6).setCellEditor(new DigitTextFieldCellEditor(EnumClass.TipoDatoEditor.DOUBLE_EDITOR).cellEditor);
        tblCierre.getColumnModel().getColumn(7).setCellEditor(new DigitTextFieldCellEditor(EnumClass.TipoDatoEditor.DOUBLE_EDITOR).cellEditor);
        tblCierre.getColumnModel().getColumn(0).setPreferredWidth(50);
        tblCierre.getColumnModel().getColumn(1).setPreferredWidth(300);
        tblCierre.getColumnModel().getColumn(3).setPreferredWidth(100);
        tblCierre.getColumnModel().getColumn(4).setPreferredWidth(100);
        tblCierre.getColumnModel().getColumn(5).setPreferredWidth(100);
        tblCierre.getColumnModel().getColumn(6).setPreferredWidth(100);
        tblCierre.getColumnModel().getColumn(7).setPreferredWidth(100);
        tblCierre.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        tblCierre.getInputMap(JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT).put(KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), "selectNextColumn");
        tblCierre.setCellSelectionEnabled(true);
        tblCierre.addKeyListener(keydata);
        CellRenderer render = new CellRenderer();
        this.tblCierre.getColumnModel().getColumn(0).setCellRenderer(new CellRendererEditListaPrecio());
        tblCierre.setDefaultRenderer(Double.class, render);
        tblCierre.setDefaultRenderer(String.class, render);
        TableColumnModel cm = tblCierre.getColumnModel();
        GroupableTableHeaderLabel header = new GroupableTableHeaderLabel(cm);
        String nombreGrupo1 = "PRECIOS EN NUEVOS SOLES (PEN)";
        String nombreGrupo2 = "PRECIOS EN DOLARES AMERICANOS (USD)";
        ColumnGroup g_name1 = new ColumnGroup(nombreGrupo1);
        ColumnGroup g_name2 = new ColumnGroup(nombreGrupo2);
        g_name1.add(cm.getColumn(2));
        g_name1.add(cm.getColumn(3));
        g_name1.add(cm.getColumn(4));
        g_name2.add(cm.getColumn(5));
        g_name2.add(cm.getColumn(6));
        g_name2.add(cm.getColumn(7));
        header.addColumnGroup(g_name1);
        header.addColumnGroup(g_name2);
        tblCierre.setTableHeader(header);
        return new JScrollPane(tblCierre);
    }

    private JPanel getPnlSouth() {
        JPanel pnlGeneral = new JPanel();
        pnlGeneral.setLayout(new BorderLayout());
        pnlGeneral.setBackground(new Color(245, 245, 245));
        pnlGeneral.setBorder(new EmptyBorder(10, 10, 10, 10));

        JPanel pnlItem = new JPanel();
        pnlGeneral.add(pnlItem, BorderLayout.WEST);
        pnlItem.setLayout(new GridBagLayout());
        GridBagConstraints gbc = LayoutUtil.getGbc();

        txtCodigo = new JTextField();
        txtCodigo.setFont(new Font("Helvetica", Font.BOLD, 16));
        txtCodigo.setForeground(Color.BLUE);
        txtCodigo.setColumns(8);
        txtCodigo.setBackground(new Color(238, 238, 238));
        txtCodigo.setEditable(false);
        pnlItem.add(txtCodigo, gbc);

        gbc.gridx = 1;
        txtItemDescripcion = new JTextField();
        txtItemDescripcion.setFont(new Font("Helvetica", Font.BOLD, 16));
        txtItemDescripcion.setForeground(Color.BLUE);
        txtItemDescripcion.setBackground(new Color(238, 238, 238));
        txtItemDescripcion.setEditable(false);
        txtItemDescripcion.setColumns(35);
        pnlItem.add(txtItemDescripcion, gbc);

        JPanel pnlOpc = new JPanel(new FlowLayout(FlowLayout.LEADING, 10, 5));
        pnlGeneral.add(pnlOpc, BorderLayout.EAST);
        btnGuardar = new JButton("Guardar", gif.SAVE16);
        btnGuardar.setMnemonic('B');
        btnGuardar.setHorizontalAlignment(SwingConstants.LEFT);
        btnGuardar.setIconTextGap(10);
        btnGuardar.setFont(new Font("Verdana", 1, 14));
        btnGuardar.setOpaque(false);
        btnGuardar.addKeyListener(this);
        btnGuardar.setFocusPainted(false);
        btnGuardar.setBorder(new EmptyBorder(5, 10, 5, 10));

        btnExportar = new JButton("Excel", gif.EXCEL);
        btnExportar.setFont(new Font("Verdana", 1, 14));
        btnExportar.setOpaque(false);
        btnExportar.setBorder(new EmptyBorder(5, 10, 5, 10));
        
        btnPdf = new JButton("PDF", gif.ExportPdf);
        btnPdf.setFont(new Font("Verdana", 1, 14));
        btnPdf.setOpaque(false);
        btnPdf.setBorder(new EmptyBorder(5, 10, 5, 10));
        pnlOpc.add(btnExportar);
        pnlOpc.add(btnPdf);
        pnlOpc.add(btnGuardar);

        return pnlGeneral;
    }

    private JPanel getPnlFiltro() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnlFiltro = new JPanel();
        pnlPrinc.add(pnlFiltro, BorderLayout.WEST);
        pnlFiltro.setLayout(new GridBagLayout());
        pnlFiltro.setBackground(new Color(245, 245, 245));
        GridBagConstraints gbc = LayoutUtil.getGbc();
        Border borderFiltro = BorderFactory.createTitledBorder(null, "Filtro", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);

        pnlPrinc.setBorder(borderFiltro);
        pnlFiltro.setOpaque(false);

        JLabel lblLocalidad = new JLabel("Localidad");
        pnlFiltro.add(lblLocalidad, gbc);

        gbc.gridx = 1;
        cboLocalidad = new JComboBox();
        pnlFiltro.add(cboLocalidad, gbc);

        gbc.gridx = 2;
        JLabel lblPuntoVenta = new JLabel("P Venta");
        lblPuntoVenta.setFont(new Font("Verdana", 0, 11));
        pnlFiltro.add(lblPuntoVenta);

        gbc.gridx = 3;
        cboPuntoVenta = new JComboBox();
        pnlFiltro.add(cboPuntoVenta, gbc);

        JLabel lblClase = new JLabel("C. Operacion");
        cboClaseOperacion = new JComboBox();
        if (Constans.IS_SEARCH_CLASE_PRECIO) {
            gbc.gridx = 4;
            pnlFiltro.add(lblClase, gbc);
            gbc.gridx = 5;
            pnlFiltro.add(cboClaseOperacion, gbc);
        }

        gbc.gridy = 1;
        gbc.gridx = 0;
        JLabel lblCodigoItem = new JLabel("Cod. Item");
        pnlFiltro.add(lblCodigoItem, gbc);

        gbc.gridx = 1;
        txtIdItem = new JTextField();
        txtIdItem.setDocument(new IntegerDocument(6));
        txtIdItem.setColumns(6);
        pnlFiltro.add(txtIdItem, gbc);

        gbc.gridx = 2;
        JLabel lblAlterno = new JLabel("Cod. Alterno");
        pnlFiltro.add(lblAlterno, gbc);

        gbc.gridx = 3;
        txtIdAlterno = new JTextField();
        txtIdAlterno.setColumns(10);
        pnlFiltro.add(txtIdAlterno, gbc);

        gbc.gridx = 4;
        JLabel lblDescripcion = new JLabel("Descripción");
        pnlFiltro.add(lblDescripcion, gbc);

        gbc.gridx = 5;
        txtDescripcion = new JTextField();
        txtDescripcion.setDocument(new UpperCaseNumberDocument(255));
        txtDescripcion.setColumns(30);
        pnlFiltro.add(txtDescripcion, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblFamilia = new JLabel("Familia");
        pnlFiltro.add(lblFamilia, gbc);

        gbc.gridx = 1;
        cboFamilia = new JComboBox();
        pnlFiltro.add(cboFamilia, gbc);

        gbc.gridx = 2;
        JLabel lblSubFamilia = new JLabel("SubFamilia");
        pnlFiltro.add(lblSubFamilia, gbc);

        gbc.gridx = 3;
        cboSubFamilia = new JComboBox();
        cboSubFamilia.setEnabled(false);
        pnlFiltro.add(cboSubFamilia, gbc);

        gbc.gridx = 4;
        JLabel lblMarca = new JLabel("Marca");
        pnlFiltro.add(lblMarca, gbc);

        gbc.gridx = 5;
        cboMarca = new JComboBox();
        pnlFiltro.add(cboMarca, gbc);

        gbc.gridx = 0;
        gbc.gridy = 3;
        JLabel lblColor = new JLabel("Grupo");
        pnlFiltro.add(lblColor, gbc);

        gbc.gridx = 1;
        cboGrupo = new JComboBox();
        pnlFiltro.add(cboGrupo, gbc);

        gbc.gridx = 2;
        JLabel lblTamano = new JLabel("Tamaño");
        pnlFiltro.add(lblTamano, gbc);

        gbc.gridx = 3;
        cboTamano = new JComboBox();
        pnlFiltro.add(cboTamano, gbc);

        grupoOpcion = new ButtonGroup();
        rdDolar = new JRadioButton("Dolares");
        rdSoles = new JRadioButton("Soles");
        grupoOpcion.add(rdDolar);
        grupoOpcion.add(rdSoles);

        gbc.gridx = 4;
        pnlFiltro.add(rdSoles, gbc);

        gbc.gridx = 5;
        pnlFiltro.add(rdDolar, gbc);

        gbc.gridx = 1;
        gbc.gridy = 4;
        btnBuscar = new JButton(gif.SEARCH16);
        btnBuscar.setHorizontalTextPosition(SwingConstants.RIGHT);
        btnBuscar.setToolTipText("Buscar");
        btnBuscar.setFont(new Font("Verdana", 1, 11));
        btnBuscar.setText("Buscar por Filtro");
        btnBuscar.setForeground(Color.red);
        btnBuscar.setContentAreaFilled(true);
        btnBuscar.setBorderPainted(true);
        btnBuscar.setFocusable(true);
        btnBuscar.setFocusPainted(false);
        pnlFiltro.add(this.btnBuscar, gbc);

        return pnlPrinc;
    }

    ActionListener actionListener = new ActionListener() {
        @Override
        public void actionPerformed(ActionEvent e) {
            if (e.getSource().equals(rdDolar)) {
                if (rdDolar.isSelected()) {
                    tblCierre.setAllTableNoEditable();
                    tblCierre.setColumnNoEditable(2);
                    tblCierre.setColumnNoEditable(3);
                    tblCierre.setColumnNoEditable(4);
                    tblCierre.setColumnEditable(5);
                    tblCierre.setColumnEditable(6);
                    tblCierre.setColumnEditable(7);
                }
            } else if (e.getSource().equals(rdSoles)) {
                if (rdSoles.isSelected()) {
                    tblCierre.setAllTableNoEditable();
                    tblCierre.setColumnEditable(2);
                    tblCierre.setColumnEditable(3);
                    tblCierre.setColumnEditable(4);
                    tblCierre.setColumnNoEditable(5);
                    tblCierre.setColumnNoEditable(6);
                    tblCierre.setColumnNoEditable(7);
                }
            }
        }
    };

    KeyListener keydata = new KeyListener() {
        @Override
        public void keyTyped(KeyEvent e) {
        }

        @Override
        public void keyPressed(KeyEvent e) {
            if (e.getKeyCode() == e.VK_ENTER) {
                try {
                    int columna = tblCierre.getSelectedColumn();
                    //System.out.println("NUMERO DE COLUMNA: " + columna);
                    if (columna >= 7) {
                        tblCierre.setColumnSelectionInterval(0, 0);
                        int fila = tblCierre.getSelectedRow();
                        if (fila < modelTblCierre.getRowCount() - 1) {
                            tblCierre.setRowSelectionInterval(fila + 1, fila + 1);
                        }
                    }
                } catch (Exception ex) {
                }
            }
        }

        @Override
        public void keyReleased(KeyEvent e) {
        }
    };

    private void reporte(String formato) {
        try {
            String rutaJasper = Constans.PATH_RPT_JASPER + "rptListaPrecio.jasper";
            String nombreArchivo = "Lista de Precios";
            Map parameters = new HashMap();
            JRDataSource dataSource = modelTblCierre.getDataSourcePrecioItem();
            File file = File.createTempFile(nombreArchivo + (new Date()).getTime(), "." + formato);
            file.deleteOnExit();
            parameters.put("NOMBRE_EMPRESA", usuario.getDescriempresa());
            parameters.put("RUC", usuario.getRuc());
            parameters.put("TIPO_REPORTE", formato);
            parameters.put(JRParameter.REPORT_LOCALE, Locale.US);
            Exportar exportar = new Exportar(file, parameters, formato, dataSource, rutaJasper);
            exportar.show();
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void cargarDatos() {
        try {
            loadLocalidad();
            loadColor();
            loadMarca();
            loadTamano();
            loadFamilia();
            this.loadClaseOperacion();
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadFamilia() {
        try {
            RnFamilia regla_Familia = new RnFamilia(path);

            if (xFamilia != null) {
                xFamilia.clear();
            } else {
                xFamilia = new ArrayList();
            }

            xFamilia.addAll(regla_Familia.listar("", "", usuario.getCodempresa()));

            cboFamilia.removeAllItems();
            cboFamilia.addItem("--- TODOS ---");

            for (int i = 0; i < xFamilia.size(); i++) {
                cboFamilia.addItem(xFamilia.get(i).getDescripcion());
            }

            cboFamilia.setSelectedIndex(0);
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

            RnSubFamilia regla_SubFamilia = new RnSubFamilia(path);

            if (xSubFamilia != null) {
                xSubFamilia.clear();
            } else {
                xSubFamilia = new ArrayList();
            }

            xSubFamilia.addAll(regla_SubFamilia.listar(s));

            cboSubFamilia.removeAllItems();
            cboSubFamilia.addItem("--- TODOS ---");

            for (int i = 0; i < xSubFamilia.size(); i++) {
                cboSubFamilia.addItem(xSubFamilia.get(i).getDescripcion());
            }

            cboSubFamilia.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadMarca() {
        try {
            RnMarca regla_Marca = new RnMarca(path);

            if (xMarca != null) {
                xMarca.clear();
            } else {
                xMarca = new ArrayList();
            }

            xMarca.addAll(regla_Marca.listarGeneral(usuario.getCodempresa()));

            cboMarca.removeAllItems();
            cboMarca.addItem("--- TODOS ---");

            for (int i = 0; i < xMarca.size(); i++) {
                cboMarca.addItem(xMarca.get(i).getDescripcion());
            }

            cboMarca.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadColor() {
        try {
            RnColor regla_Color = new RnColor(path);

            if (xColor != null) {
                xColor.clear();
            } else {
                xColor = new ArrayList();
            }

            xColor.addAll(regla_Color.listar("", "", usuario.getCodempresa()));

            cboGrupo.removeAllItems();
            cboGrupo.addItem("--- TODOS ---");

            for (int i = 0; i < xColor.size(); i++) {
                cboGrupo.addItem(xColor.get(i).getDescripcion());
            }

            cboGrupo.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadTamano() {
        try {
            RnTamano regla_Tamano = new RnTamano(path);

            if (xTamano != null) {
                xTamano.clear();
            } else {
                xTamano = new ArrayList();
            }

            xTamano.addAll(regla_Tamano.listarGeneral(usuario.getCodempresa()));

            cboTamano.removeAllItems();
            cboTamano.addItem("--- TODOS ---");

            for (int i = 0; i < xTamano.size(); i++) {
                cboTamano.addItem(xTamano.get(i).getDescripcion());
            }

            cboTamano.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadLocalidad() {
        try {
            RnLocalidad regla_SubFamilia = new RnLocalidad(path);

            if (xLocalidad != null) {
                xLocalidad.clear();
            } else {
                xLocalidad = new ArrayList();
            }

            xLocalidad.addAll(regla_SubFamilia.listar("", usuario.getCodempresa(), "", "", ""));

            cboLocalidad.removeAllItems();
            cboLocalidad.addItem("--- TODOS ---");

            for (int i = 0; i < xLocalidad.size(); i++) {
                cboLocalidad.addItem(xLocalidad.get(i).getDescripcion());
            }

            if (cboLocalidad.getItemCount() > 0) {
                cboLocalidad.setSelectedIndex(1);
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadPuntoVenta(String xcodLocalidad) {
        try {
            RnPuntoVenta regla_PuntoVenta = new RnPuntoVenta(path);

            if (xPuntoVenta != null) {
                xPuntoVenta.clear();
            } else {
                xPuntoVenta = new ArrayList();
            }

            xPuntoVenta.addAll(regla_PuntoVenta.listar("", "", xcodLocalidad, "", "", "", "", ""));

            cboPuntoVenta.removeAllItems();
            cboPuntoVenta.addItem("--- TODOS ---");

            for (int i = 0; i < xPuntoVenta.size(); i++) {
                cboPuntoVenta.addItem(xPuntoVenta.get(i).getDescripcion_puntoventa());
            }
            cboPuntoVenta.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void cargarTabla() {
        try {
            RnPreciosCab regla = new RnPreciosCab(path);
            modelTblCierre.clearTable();

            Item it = new Item();
            it.setId_empresa(usuario.getCodempresa());
            it.setId_familia(cboFamilia.getSelectedIndex() > 0 ? xFamilia.get(cboFamilia.getSelectedIndex() - 1).getIdFamilia() : "");
            it.setId_sub_familia(cboSubFamilia.getSelectedIndex() > 0 ? xSubFamilia.get(cboSubFamilia.getSelectedIndex() - 1).getIdSubFamilia() : "");
            it.setId_marca(cboMarca.getSelectedIndex() > 0 ? xMarca.get(cboMarca.getSelectedIndex() - 1).getIdMarca() : "");
            it.setId_color(cboGrupo.getSelectedIndex() > 0 ? xColor.get(cboGrupo.getSelectedIndex() - 1).getIdColor() : "");
            it.setId_tamano(cboTamano.getSelectedIndex() > 0 ? xTamano.get(cboTamano.getSelectedIndex() - 1).getIdTamano() : "");
            it.setId_alterno(txtIdAlterno.getText().trim());
            it.setId_item(txtIdItem.getText().trim());
            it.setIdClaseOperacion(LoadComboItem.getIdCombo(cboClaseOperacion));
            it.setDescripcion(txtDescripcion.getText().trim());

            PreciosItem p = new PreciosItem();
            p.setId_localidad(cboLocalidad.getSelectedIndex() > 0 ? xLocalidad.get(cboLocalidad.getSelectedIndex() - 1).getId_localidad() : "");
            p.setItem(it);

            modelTblCierre.agregarVectoralmacen(regla.listarPrecios(p));
            tblCierre.setModel(modelTblCierre);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getComponent() == txtIdItem) {
            txtIdItem.selectAll();
        }

        if (e.getComponent() == txtIdAlterno) {
            txtIdAlterno.selectAll();
        }

        if (e.getComponent() == txtDescripcion) {
            txtDescripcion.selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txtIdItem && txtIdItem.getText().trim().length() > 0) {
            String serie = "000000" + txtIdItem.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 6, serie.length());
            txtIdItem.setText(nuevaserie);
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == cboLocalidad) {
                cboPuntoVenta.requestFocus();
            }
            if (e.getSource() == txtIdItem) {
                txtIdAlterno.requestFocus();
            }

            if (e.getSource() == txtIdAlterno) {
                txtDescripcion.requestFocus();
            }

            if (e.getSource() == txtDescripcion) {
                cboFamilia.requestFocus();
            }

            if (e.getSource() == cboFamilia) {
                if (cboSubFamilia.isEnabled()) {
                    cboSubFamilia.requestFocus();
                } else {
                    cboMarca.requestFocus();
                }
            }

            if (e.getSource() == cboSubFamilia) {
                cboMarca.requestFocus();
            }

            if (e.getSource() == cboMarca) {
                cboGrupo.requestFocus();
            }

            if (e.getSource() == cboGrupo) {
                cboTamano.requestFocus();
            }

            if (e.getSource() == cboTamano) {
                btnBuscar.requestFocus();
            }
        }
    }

    @Override
    public void mouseClicked(MouseEvent e) {
        if (e.getClickCount() == 1) {
            if (e.getSource() == tblCierre) {
                this.selectedItem();

            }
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if ((e.getKeyCode() == KeyEvent.VK_DOWN)
                || (e.getKeyCode() == KeyEvent.VK_UP)
                || (e.getKeyCode() == KeyEvent.VK_PAGE_DOWN)
                || (e.getKeyCode() == KeyEvent.VK_PAGE_UP)) {
            if (e.getSource() == tblCierre) {
                this.selectedItem();
            }
        }
    }

    private void guardarPrecios_v2() {
        try {
            RnPreciosCab obj = new RnPreciosCab(path);
            List<PreciosItem> lista = modelTblCierre.getDataUpdated();

            for (PreciosItem precioItem : lista) {
                obj.guardarPrecios(precioItem, UsuarioAUD.CODIGO_USUARIO);
            }

            cuadro.CuadroAviso("Registros guardados", JOptionPane.PLAIN_MESSAGE);
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            cuadro.CuadroAviso("Error al guardar los precios", JOptionPane.WARNING_MESSAGE);
        }

    }

    @Override
    public void mouseReleased(MouseEvent e) {
        if (e.getSource() == tblCierre) {
            this.selectedItem();
        }
    }

    private void selectedItem() {
        int fila = tblCierre.getSelectedRow();
        if (fila < 0) {
            return;
        }
        PreciosItem p = modelTblCierre.getPrecioItem(tblCierre.convertRowIndexToModel(tblCierre.getSelectedRow()));
        Item item = p.getItem();
        txtCodigo.setText(Constans.IS_BUSQUEDA_ITEM_ALTERNO ? item.getId_alterno() : item.getId_item());
        txtItemDescripcion.setText(item.getDescripcion());
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == btnGuardar) {
            this.guardarPrecios_v2();
        }
        if (e.getSource() == btnBuscar) {
            cargarTabla();
        }
        if (e.getSource().equals(btnExportar)) {
            this.reporte("xlsx");
        }
        if (e.getSource().equals(btnPdf)) {
            this.reporte("pdf");
        }

        if (cboFamilia == e.getSource()) {
            if (cboFamilia.getItemCount() > 0) {
                if (cboFamilia.getSelectedIndex() == 0) {
                    cboSubFamilia.removeAllItems();
                    cboSubFamilia.setEnabled(false);
                } else {
                    cboSubFamilia.setEnabled(true);
                    loadSubFamilia(xFamilia.get(cboFamilia.getSelectedIndex() - 1).getIdFamilia());
                }
            }
        }

        if (cboLocalidad == e.getSource()) {
            if (cboLocalidad.getItemCount() >= 0) {
                if (cboLocalidad.getSelectedIndex() <= 0) {
                    cboPuntoVenta.removeAllItems();
                    cboPuntoVenta.setEnabled(false);
                } else {
                    cboPuntoVenta.setEnabled(true);
                    loadPuntoVenta(xLocalidad.get(cboLocalidad.getSelectedIndex() - 1).getId_localidad());
                }
            }
        }
    }

    public void selectInternalFrame() {
        try {
            setSelected(true);
        } catch (PropertyVetoException e) {
        }
    }

    @Override
    public void mousePressed(MouseEvent e) {
    }

    @Override
    public void mouseEntered(MouseEvent e) {
    }

    @Override
    public void mouseExited(MouseEvent e) {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }
}
