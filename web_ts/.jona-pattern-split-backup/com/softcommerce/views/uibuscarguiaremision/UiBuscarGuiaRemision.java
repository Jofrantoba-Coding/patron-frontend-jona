/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uibuscarguiaremision;


import com.softcommerce.formularios.*;
/**
 *
 * @author ibrahim
 */
import com.softcommerce.general.controles.JHInternal;
import com.softcommerce.iconos.Gif;
import java.awt.Color;
import java.awt.Component;
import java.awt.Font;
import java.awt.Frame;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
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
import com.softcommerce.general.controles.CFormattedTextField;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.event.FocusListener;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.swing.JComponent;
import javax.swing.JFormattedTextField;
import javax.swing.KeyStroke;
import javax.swing.RowFilter;
import javax.swing.RowFilter.ComparisonType;
import javax.swing.table.TableRowSorter;
import javax.swing.text.DefaultFormatterFactory;
import javax.swing.text.MaskFormatter;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.general.tablas.BuscarGuiaRemisionTableModel;
import com.softcommerce.util.ExceptionHandler;
import java.net.URL;
import javax.swing.JOptionPane;
import org.apache.log4j.Logger;

public class UiBuscarGuiaRemision
        extends JDialog
        implements InterUiBuscarGuiaRemision, ActionListener, KeyListener, WindowListener, FocusListener {
    
    private JHInternal ari;
    private Component comp;
    
    private String id_empresa;
    private String id_localidad;
    private String id_punto_venta;
    private int indiceTabla;
    
    private JTabbedPane tabSearch;
    private BuscarGuiaRemisionTableModel modeltblSearch;
    private TableRowSorter modeloOrdenado;
    private CTable tblSearch;
    private JScrollPane scrollSearch;
    
    private JButton btn_Refrescar;
    private JButton btn_Agregar;
    private JButton cbCancel;
    
    private JComboBox cbEstadoDocumento;
    private JComboBox cbFechaInicio;
    private JComboBox cbFechaFin;
    
    private JFormattedTextField txtSerie;
    private JFormattedTextField txtFechaInicio;
    private JFormattedTextField txtFechaFin;
    
    private JTextField txtRuc;
    private JTextField txtRazonSocial;
    private JTextField txtCodigoDespacho;
    private final URL path;
    private final Logger logger = Logger.getLogger(UiBuscarGuiaRemision.class);
    
    public UiBuscarGuiaRemision(Frame arg0, JHInternal arg1, URL path) {
        super(arg0);
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
        
        modeltblSearch = new BuscarGuiaRemisionTableModel();
        modeloOrdenado = new TableRowSorter(modeltblSearch);
        tblSearch = new CTable();
        tblSearch.setRowSorter(modeloOrdenado);
        tblSearch.setModel(modeltblSearch);
        tblSearch.setAllTableNoEditable();
        tblSearch.setAllColumnNoResizable();
        tblSearch.setRendererColumnZero();
        
        tblSearch.setAllColumnPreferredWidth();
        KeyStroke keystroke4 = KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false);
        ActionListener action4 = new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                obtenerDatos();
            }
        };
        tblSearch.registerKeyboardAction(action4, keystroke4, JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);
        
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
        
        MaskFormatter maskCorrelativoSerie = null;
        
        try {
            maskCorrelativoSerie = new MaskFormatter("AA/###-##########");
            maskCorrelativoSerie.setPlaceholderCharacter('_');
            
            txtSerie = new JFormattedTextField(maskCorrelativoSerie);
            txtSerie.setValue(new String());
            txtSerie.setFocusLostBehavior(CFormattedTextField.PERSIST);
            txtSerie.commitEdit();
        } catch (ParseException e) {
        }
        
        txtSerie.setBounds(265, 25, 125, 20);
        txtSerie.setForeground(Color.BLACK);
        txtSerie.setFont(new Font(Font.SANS_SERIF, Font.BOLD | Font.ITALIC, 12));
        txtSerie.addFocusListener(this);
        txtSerie.addKeyListener(this);
        pnl.add(txtSerie);
        
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
        
        MaskFormatter mfFecha = null;
        
        try {
            mfFecha = new MaskFormatter("##/##/####");
            mfFecha.setPlaceholderCharacter('0');
        } catch (ParseException localParseException) {
        }
        
        DefaultFormatterFactory facFecha = new DefaultFormatterFactory(mfFecha, mfFecha, mfFecha);
        
        txtFechaInicio = new JFormattedTextField();
        txtFechaInicio.addKeyListener(this);
        txtFechaInicio.setBounds(310, 55, 80, 20);
        txtFechaInicio.addFocusListener(this);
        txtFechaInicio.setFont(new JTextField().getFont());
        txtFechaInicio.setFormatterFactory(facFecha);
        pnl.add(txtFechaInicio);
        
        cbFechaInicio = new JComboBox();
        cbFechaInicio.setBounds(260, 55, 45, 20);
        cbFechaInicio.addItem("=");
        cbFechaInicio.addItem("<>");
        cbFechaInicio.addItem("<");
        cbFechaInicio.addItem(">");
        cbFechaInicio.addActionListener(this);
        cbFechaInicio.addKeyListener(this);
        pnl.add(cbFechaInicio);
        
        JLabel lblFechaInicio = new JLabel("Fecha Inicio");
        lblFechaInicio.setDisplayedMnemonic('c');
        lblFechaInicio.setLabelFor(txtFechaInicio);
        lblFechaInicio.setBounds(190, 55, 100, 20);
        pnl.add(lblFechaInicio);
        
        txtFechaFin = new JFormattedTextField();
        txtFechaFin.addKeyListener(this);
        txtFechaFin.setBounds(522, 55, 80, 20);
        txtFechaFin.setFont(new JTextField().getFont());
        txtFechaFin.addFocusListener(this);
        txtFechaFin.setFormatterFactory(facFecha);
        pnl.add(txtFechaFin);
        
        cbFechaFin = new JComboBox();
        cbFechaFin.setBounds(472, 55, 45, 20);
        cbFechaFin.addItem("=");
        cbFechaFin.addItem("<>");
        cbFechaFin.addItem("<");
        cbFechaFin.addItem(">");
        cbFechaFin.addActionListener(this);
        cbFechaFin.addKeyListener(this);
        pnl.add(cbFechaFin);
        
        JLabel lblFechaFin = new JLabel("Fecha Fin");
        lblFechaFin.setBounds(417, 55, 90, 20);
        lblFechaFin.setDisplayedMnemonic('a');
        lblFechaFin.setLabelFor(txtFechaFin);
        pnl.add(lblFechaFin);
        
        JLabel lbl_familia = new JLabel("Estado");
        lbl_familia.setFont(new Font("Verdana", 0, 11));
        lbl_familia.setBounds(642, 55, 50, 20);
        pnl.add(lbl_familia);
        
        cbEstadoDocumento = new JComboBox();
        cbEstadoDocumento.setBounds(691, 55, 160, 20);
        cbEstadoDocumento.addItem("--- SELECCIONE ESTADO ---");
        cbEstadoDocumento.addItem("ATENDIDO");
        cbEstadoDocumento.addItem("PARCIALMENTE ATENDIDO");
        cbEstadoDocumento.addActionListener(this);
        cbEstadoDocumento.addKeyListener(this);
        pnl.add(cbEstadoDocumento);
        
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
        setTitle("Buscar Guia de Traslado");
        setContentPane(tabSearch);
        setModal(true);
        setResizable(false);
        setSize(915, 475);
        ComponentToolKit.centerComponentPosicion(this);
    }
    
    public void cargarTabla(String id_empresa, String id_localidad, String id_punto_venta, Component comp, int indiceTabla) {
        try {
            txtCodigoDespacho.setText("");
            txtRuc.setText("");
            txtRazonSocial.setText("");
            txtFechaFin.setText("00/00/0000");
            txtFechaInicio.setText("00/00/0000");
            
            this.id_empresa = id_empresa;
            this.id_localidad = id_localidad;
            this.id_punto_venta = id_punto_venta;
            this.comp = comp;
            this.indiceTabla = indiceTabla;
            
            RnRegContaCab regla = new RnRegContaCab(path);
            modeltblSearch.clearTable();
            modeltblSearch.agregarListGuiaRemision(regla.listar(id_empresa, id_localidad, "09", "", "", "", new Date(1901, 0, 1), "", "", "", "", "", "", "", new Date(1901, 0, 1), "BXC", "006", id_punto_venta, new Date(1901, 0, 1), new Date(1901, 0, 1)));
            tblSearch.setAllColumnPreferredWidth();
            
            ComponentToolKit.centerComponentPosicion(this);
            setVisible(true);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }
    
    @Override
    public void windowOpened(WindowEvent e) {
        txtRazonSocial.requestFocus();
    }
    
    @Override
    public void windowClosing(WindowEvent e) {
        setVisible(false);
    }
    
    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txtCodigoDespacho)
                    || (e.getSource() == txtSerie)
                    || (e.getSource() == txtRazonSocial)
                    || (e.getSource() == txtRuc)
                    || (e.getSource() == txtFechaInicio)
                    || (e.getSource() == txtFechaFin)) {
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
                txtSerie.requestFocus();
            }
            
            if (txtSerie == e.getSource()) {
                txtRazonSocial.requestFocus();
            }
            
            if (txtRazonSocial == e.getSource()) {
                txtRuc.requestFocus();
            }
            
            if (txtRuc == e.getSource()) {
                txtFechaInicio.requestFocus();
            }
            
            if (txtFechaInicio == e.getSource()) {
                txtFechaFin.requestFocus();
            }
            
            if (txtFechaFin == e.getSource()) {
                cbEstadoDocumento.requestFocus();
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
        
        if (e.getSource() == txtFechaFin) {
            txtFechaFin.selectAll();
        }
        
        if (e.getSource() == txtFechaInicio) {
            txtFechaInicio.selectAll();
        }
        
        if (e.getSource() == txtRazonSocial) {
            txtRazonSocial.selectAll();
        }
        
        if (e.getSource() == txtRuc) {
            txtRuc.selectAll();
        }
        
        if (e.getSource() == txtSerie) {
            txtSerie.selectAll();
        }
    }
    
    @Override
    public void actionPerformed(ActionEvent e) {
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
        
        if (e.getSource() == cbFechaFin) {
            filtrar();
        }
        
        if (e.getSource() == cbFechaInicio) {
            filtrar();
        }
    }
    
    public ComparisonType getCondicionFechaFinal() {
        if (cbFechaFin.getSelectedItem().toString().trim().equals("<")) {
            return ComparisonType.BEFORE;
        } else if (cbFechaFin.getSelectedItem().toString().trim().equals(">")) {
            return ComparisonType.AFTER;
        } else if (cbFechaFin.getSelectedItem().toString().trim().equals("<>")) {
            return ComparisonType.NOT_EQUAL;
        } else {
            return ComparisonType.EQUAL;
        }
    }
    
    public ComparisonType getCondicionFechaInicial() {
        if (cbFechaInicio.getSelectedItem().toString().trim().equals("<")) {
            return ComparisonType.BEFORE;
        } else if (cbFechaInicio.getSelectedItem().toString().trim().equals(">")) {
            return ComparisonType.AFTER;
        } else if (cbFechaInicio.getSelectedItem().toString().trim().equals("<>")) {
            return ComparisonType.NOT_EQUAL;
        } else {
            return ComparisonType.EQUAL;
        }
    }
    
    public RowFilter getFilter() {
        List filters = new ArrayList();
        
        String f_completo = txtSerie.getText().substring(0, 17).replaceAll("[/_-]", "").trim();
        String f_doc = txtSerie.getText().substring(0, 2).replaceAll("[_]", "").trim();
        String f_serie = txtSerie.getText().substring(0, 6).replaceAll("[_]", "").trim();
        
        if (f_completo.length() > 0) {
            if (f_serie.length() == 6) {
                String f_doc_serie = txtSerie.getText().substring(0, 17).replaceAll("[_]", "").trim();
                filters.add(RowFilter.regexFilter("^" + f_doc_serie, 2));
            } else if (f_doc.length() == 2) {
                filters.add(RowFilter.regexFilter("^" + f_doc, 2));
            }
        }
        
        if (cbEstadoDocumento.getSelectedIndex() > 0) {
            String f_estado = cbEstadoDocumento.getSelectedItem().toString().trim();
            filters.add(RowFilter.regexFilter("^" + f_estado, 7));
        }
        
        String f_razonsocial = txtRazonSocial.getText().trim();
        
        if (f_razonsocial.length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + f_razonsocial + ".*", 3));
        }
        
        String f_codigo = txtCodigoDespacho.getText().trim();
        
        if (f_codigo.length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + f_codigo + ".*", 0));
        }
        
        String f_ruc = txtRuc.getText().trim();
        
        if (f_ruc.length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + f_ruc + ".*", 5));
        }
        
        String f_fechainicio = txtFechaInicio.getText().trim();
        
        if (DateTime.isValidDate(f_fechainicio)) {
            Date fechaInicio = DateTime.getDateFecha(f_fechainicio);
            filters.add(RowFilter.dateFilter(getCondicionFechaInicial(), fechaInicio, 1));
        }
        
        String f_fechafin = txtFechaFin.getText().trim();
        
        if (DateTime.isValidDate(f_fechafin)) {
            Date fechaFin = DateTime.getDateFecha(f_fechafin);
            filters.add(RowFilter.dateFilter(getCondicionFechaFinal(), fechaFin, 6));
        }
        
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        
        return fooBarFilter;
    }
    
    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txtSerie) {
            if (e.getSource() == txtSerie) {
                String serieguia = "00" + txtSerie.getText().substring(0, 2).replaceAll("[_]", "");
                String nuevaserieguia = serieguia.substring(serieguia.length() - 2, serieguia.length());
                if (nuevaserieguia.equals("00")) {
                    nuevaserieguia = "__";
                }
                
                String serieguia2 = "000" + txtSerie.getText().substring(3, 6).replaceAll("[_]", "");
                String nuevaserieguia2 = serieguia2.substring(serieguia2.length() - 3, serieguia2.length());
                if (nuevaserieguia2.equals("000")) {
                    nuevaserieguia2 = "___";
                }
                
                String preimpresoguia = "0000000000" + txtSerie.getText().substring(7, 17).replaceAll("[_]", "");
                String nuevapreimpresoguia = preimpresoguia.substring(preimpresoguia.length() - 10, preimpresoguia.length());
                if (nuevapreimpresoguia.equals("0000000000")) {
                    nuevapreimpresoguia = "__________";
                }
                
                String nuevaserieguiaref = nuevaserieguia + "/" + nuevaserieguia2 + "-" + nuevapreimpresoguia;
                txtSerie.setText(nuevaserieguiaref);
                
                filtrar();
            }
        }
    }
    
    public void obtenerDatos() {
        int row = tblSearch.getSelectedRow();
        
        if (row >= 0) {
            Object valor = tblSearch.getValueAt(row, indiceTabla);
            ari.setValueSearch(valor, comp);
            setVisible(false);
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
    
    
}
