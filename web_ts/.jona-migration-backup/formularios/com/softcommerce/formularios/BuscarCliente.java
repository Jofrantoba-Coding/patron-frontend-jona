/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.formularios;

import com.softcommerce.beans.Anexo;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.iconos.Gif;
import java.awt.Color;
import java.awt.Component;
import java.awt.Font;
import java.awt.Frame;
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
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTextField;
import javax.swing.SwingConstants;
import javax.swing.border.EmptyBorder;
import com.softcommerce.general.controles.CDialog;
import com.softcommerce.general.controles.JHInternal;
import com.softcommerce.general.controles.JHInternalDialog;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.Dialog;
import java.awt.event.FocusListener;
import java.awt.event.ItemListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.KeyStroke;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.general.tablas.AnexoTableModel;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.RowFilter;
import javax.swing.table.TableRowSorter;

public class BuscarCliente extends JDialog implements ActionListener, KeyListener, WindowListener, ItemListener, FocusListener {
    
    private CDialog ard;
    private JHDialog dialog;
    private JHInternalDialog ari;
    private JHDialog ar3;
    private Component comp;
    private int indiceTabla;
    private JTabbedPane tabSearch;
    private AnexoTableModel modeltblSearch;
    private CTable tblSearch;
    private JScrollPane scrollSearch;
    private JButton btn_buscardocumento;
    private JButton btn_Agregar;
    private JButton cbCancel;
    private JComboBox cb_clasificacion;
    private List<Anexo> xclasificacion;
    private JTextField txt_idanexo;
    private JTextField txt_ruc;
    private JTextField txt_descripcion;
    private JTextField txtDireccion;
    private JHInternal ar33;
    private Object argIntFrame;
    private Anexo an;
    private java.net.URL path;
    private String strForm;
    
    public BuscarCliente(CDialog arg1, java.net.URL path) {
        super(arg1);
        this.path = path;
        this.ard = arg1;
        initialize();
    }
    
    public BuscarCliente(Frame arg0, CDialog arg1, java.net.URL path) {
        super(arg0);
        this.path = path;
        this.ard = arg1;
        initialize();
    }
    
    public BuscarCliente(Dialog arg0, JHDialog arg1, java.net.URL path) {
        super(arg0);
        this.path = path;
        this.ar3 = arg1;
        initialize();
    }
    
    public BuscarCliente(JFrame arg0, JHInternal arg1, java.net.URL path) {
        super(arg0);
        this.path = path;
        this.ar33 = arg1;
        initialize();
    }
    
    public BuscarCliente(JFrame arg0, Object arg1, java.net.URL path, String wForm) {
        super(arg0);
        this.path = path;
        this.argIntFrame = arg1;
        this.strForm = wForm;
        initialize();
    }
    
    public BuscarCliente(Dialog arg0, CDialog arg1, java.net.URL path) {
        super(arg0);
        this.path = path;
        this.ard = arg1;
        initialize();
    }
    
    public BuscarCliente(JHDialog arg0, java.net.URL path) {
        super(arg0);
        this.path = path;
        this.dialog = arg0;
        initialize();
    }
    
    public BuscarCliente(Frame arg0, JHInternalDialog arg1, java.net.URL path) {
        super(arg0);
        this.path = path;
        this.ari = arg1;
        initialize();
    }
    
    private void initialize() {
        addWindowListener(this);
        addKeyListener(this);
        
        Gif gif = new Gif();
        
        JPanel pnl = new JPanel();
        pnl.setBackground(new Color(243, 248, 252));
        pnl.setOpaque(false);
        pnl.setLayout(null);
        
        modeltblSearch = new AnexoTableModel();
        tblSearch = new CTable();
        tblSearch.setModel(modeltblSearch);
        tblSearch.setNoVisibleColumn(0);
        tblSearch.setNoVisibleColumn(2);
        tblSearch.setNoVisibleColumn(4);
        tblSearch.setNoVisibleColumn(5);
        tblSearch.setNoVisibleColumn(6);
        tblSearch.setNoVisibleColumn(7);
        tblSearch.setNoVisibleColumn(9);
        tblSearch.setNoVisibleColumn(10);
        tblSearch.setNoVisibleColumn(12);
        tblSearch.setNoVisibleColumn(13);
        tblSearch.setNoVisibleColumn(14);
        tblSearch.setNoVisibleColumn(15);
        tblSearch.setNoVisibleColumn(16);
        tblSearch.setNoVisibleColumn(17);
        tblSearch.setNoVisibleColumn(18);
        tblSearch.setNoVisibleColumn(19);
        tblSearch.setNoVisibleColumn(20);
        tblSearch.setNoVisibleColumn(21);
        tblSearch.setNoVisibleColumn(22);
        tblSearch.setNoVisibleColumn(23);
        tblSearch.setNoVisibleColumn(24);
        tblSearch.setNoVisibleColumn(25);
        tblSearch.setNoVisibleColumn(26);
        tblSearch.setNoVisibleColumn(27);
        tblSearch.setNoVisibleColumn(28);
        tblSearch.setNoVisibleColumn(29);
        tblSearch.setNoVisibleColumn(35);
        tblSearch.setNoVisibleColumn(34);
        tblSearch.setAllTableNoEditable();
        tblSearch.setAllColumnNoResizable();
        tblSearch.setRendererColumnZero();
        tblSearch.setAllColumnPreferredWidth();
        tblSearch.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                obtenerDatos();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);
        
        scrollSearch = new JScrollPane(tblSearch, JScrollPane.VERTICAL_SCROLLBAR_ALWAYS, JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS);
        scrollSearch.setBounds(20, 70, 855, 282);
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
        
        
        JLabel lbl_CodigoItem = new JLabel("Código");
        lbl_CodigoItem.setBounds(20, 10, 40, 20);
        lbl_CodigoItem.setFont(new Font("Verdana", 0, 11));
        pnl.add(lbl_CodigoItem);
        
        txt_idanexo = new JTextField();
        txt_idanexo.setBounds(75, 10, 90, 20);
        txt_idanexo.addKeyListener(new KeyListener() {
            @Override
            public void keyTyped(KeyEvent e) {
            }
            
            @Override
            public void keyPressed(KeyEvent e) {
            }
            
            @Override
            public void keyReleased(KeyEvent e) {
                if (e.getSource().equals(txt_idanexo)) {
                    filtrarTabla(tblSearch, modeltblSearch);
                }
            }
        });
        txt_idanexo.setDocument(new IntegerDocument(11));
        txt_idanexo.addFocusListener(this);
        txt_idanexo.setFont(new Font("Garamond", 0, 14));
        pnl.add(txt_idanexo);
        
        JLabel lblItem = new JLabel("Desc.");
        lblItem.setFont(new Font("Verdana", 0, 11));
        lblItem.setBounds(205, 10, 35, 20);
        pnl.add(lblItem);
        
        txt_descripcion = new JTextField();
        txt_descripcion.setBounds(240, 10, 360, 20);
        txt_descripcion.addFocusListener(this);
        txt_descripcion.setFont(new Font("Garamond", 0, 14));
        txt_descripcion.setDocument(new UpperCaseNumberDocument(255));
        txt_descripcion.addKeyListener(new KeyListener() {
            @Override
            public void keyTyped(KeyEvent e) {
            }
            
            @Override
            public void keyPressed(KeyEvent e) {
            }
            
            @Override
            public void keyReleased(KeyEvent e) {
                if (e.getSource().equals(txt_descripcion)) {
                    filtrarTabla(tblSearch, modeltblSearch);
                }
            }
        });
        pnl.add(txt_descripcion);
        
        JLabel lbl_CodigoAlterno = new JLabel("DNI/RUC");
        lbl_CodigoAlterno.setBounds(650, 10, 60, 20);
        lbl_CodigoAlterno.setFont(new Font("Verdana", 0, 11));
        pnl.add(lbl_CodigoAlterno);
        
        txt_ruc = new JTextField();
        txt_ruc.setBounds(710, 10, 90, 20);
        txt_ruc.addFocusListener(this);
        txt_ruc.addKeyListener(new KeyListener() {
            @Override
            public void keyTyped(KeyEvent e) {
            }
            
            @Override
            public void keyPressed(KeyEvent e) {
            }
            
            @Override
            public void keyReleased(KeyEvent e) {
                if (e.getSource().equals(txt_ruc)) {
                    filtrarTabla(tblSearch, modeltblSearch);
                }
            }
        });
        txt_ruc.setDocument(new IntegerDocument(11));
        txt_ruc.setFont(new Font("Garamond", 0, 14));
        pnl.add(txt_ruc);
        
        JLabel lbl_clasificacion = new JLabel("Clasificación");
        lbl_clasificacion.setBounds(20, 40, 70, 20);
        pnl.add(lbl_clasificacion);
        
        cb_clasificacion = new JComboBox();
        cb_clasificacion.setBounds(90, 40, 208, 20);
        cb_clasificacion.setFont(new Font(Font.SANS_SERIF, 0, 9));
        cb_clasificacion.addKeyListener(this);
        cb_clasificacion.addActionListener(this);
        pnl.add(cb_clasificacion);
        
        JLabel lbl_direccion = new JLabel("Direccion");
        lbl_direccion.setBounds(305, 40, 70, 20);
        pnl.add(lbl_direccion);
        
        txtDireccion = new JTextField();
        txtDireccion.setBounds(375, 40, 208, 20);
        txtDireccion.setFont(new Font(Font.SANS_SERIF, 0, 9));
        txtDireccion.addKeyListener(new KeyListener() {
            @Override
            public void keyTyped(KeyEvent e) {
            }
            
            @Override
            public void keyPressed(KeyEvent e) {
            }
            
            @Override
            public void keyReleased(KeyEvent e) {
                if (e.getSource().equals(txtDireccion)) {
                    filtrarTabla(tblSearch, modeltblSearch);
                }
            }
        });
        pnl.add(txtDireccion);
        
        
        btn_buscardocumento = new JButton("F5", gif.SEARCH16);
        btn_buscardocumento.setBounds(810, 25, 70, 20);
        btn_buscardocumento.setMnemonic('B');
        btn_buscardocumento.setFont(new Font(Font.SANS_SERIF, 0, 9));
        btn_buscardocumento.setOpaque(false);
        btn_buscardocumento.setIconTextGap(10);
        btn_buscardocumento.setToolTipText("Buscar Documento");
        btn_buscardocumento.setHorizontalAlignment(SwingConstants.LEFT);
        btn_buscardocumento.setContentAreaFilled(true);
        btn_buscardocumento.setBorderPainted(true);
        btn_buscardocumento.setFocusable(true);
        btn_buscardocumento.setFocusPainted(false);
        btn_buscardocumento.addFocusListener(this);
        btn_buscardocumento.addActionListener(this);
        btn_buscardocumento.addKeyListener(this);
        btn_buscardocumento.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        pnl.add(this.btn_buscardocumento);
        
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
        tabSearch.add("Cliente", pnl);
        tabSearch.setBorder(new EmptyBorder(5, 5, 5, 5));
        tabSearch.setBackground(new Color(243, 248, 252));
        
        setBackground(new Color(245, 245, 245));
        setContentPane(tabSearch);
        setModal(true);
        setResizable(false);
        setSize(915, 475);
        ComponentToolKit.centerComponentPosicion(this);
    }
    
    private void filtrarTabla(JTable tabla, AnexoTableModel model) {
        TableRowSorter<AnexoTableModel> sorter = new TableRowSorter<AnexoTableModel>(model);
        RowFilter<AnexoTableModel, Object> rf1 = null;
        RowFilter<AnexoTableModel, Object> rf2 = null;
        RowFilter<AnexoTableModel, Object> rf3 = null;
        RowFilter<AnexoTableModel, Object> rf4 = null;
        List<RowFilter<AnexoTableModel, Object>> rfs = new ArrayList<RowFilter<AnexoTableModel, Object>>(4);
        try {
            rf1 = RowFilter.regexFilter(".*" + txtDireccion.getText() + ".*", 11);
            rf2 = RowFilter.regexFilter(".*" + txt_descripcion.getText() + ".*", 3);
            rf3 = RowFilter.regexFilter(".*" + txt_ruc.getText() + ".*", 8);
            rf4 = RowFilter.regexFilter(".*" + txt_idanexo.getText() + ".*", 1);
            rfs.add(rf1);
            rfs.add(rf2);
            rfs.add(rf3);
            rfs.add(rf4);
            RowFilter<AnexoTableModel, Object> af = RowFilter.andFilter(rfs);
            sorter.setRowFilter(af);
            tabla.setRowSorter(sorter);
        } catch (Exception ex) {
            return;
        }
    }
    
    public void cargarTabla(
            Anexo a, Component ls_comp, int ls_indiceTabla) {
        txt_descripcion.setText(null);
        txt_ruc.setText(null);
        txt_idanexo.setText(null);
        
        an = a;
        this.comp = ls_comp;
        this.indiceTabla = ls_indiceTabla;
        
        loadVendedor();
        //txt_descripcion.setText(an.getDescripcion());
        //txt_ruc.setText(an.getNumerodoc());
        cargarTabla();
        
        ComponentToolKit.centerComponentPosicion(this);
        setVisible(true);
    }
    
    public void obtenerDatos() {
        int row = tblSearch.getSelectedRow();
        
        if (row >= 0) {
            Object valor = tblSearch.getValueAt(row, indiceTabla);
            
            if (ar3 != null) {
                ar3.setValueSearch(valor, comp);
            }
            
            if (ar33 != null) {
                ar33.setValueSearch(valor, comp);
            }
            
            if (dialog != null) {
                dialog.setValueSearch(valor, comp);
            }
            if (ard != null) {
                ard.setValueSearch(valor, comp);
            }
            if (ari != null) {
                ari.setValueSearch(valor, comp);
            }
            if (argIntFrame != null) {
                if (strForm.equals("cotizacion")) {
                    ((RegisterCotizacion) argIntFrame).setValueSearch(valor, comp);
                }else if (strForm.equals("venta")) {
                    ((RegisterVentaDirecta) argIntFrame).setValueSearch(valor, comp);
                }else if (strForm.equals("ventaLote")) {
                    ((RegisterVentaLote) argIntFrame).setValueSearch(valor, comp);
                }else if (strForm.equals("ventaResumen")) {
                    ((RegisterVentaResumen) argIntFrame).setValueSearch(valor, comp);
                }else if (strForm.equals("ventaCosto")) {
                    ((RegisterVentaCosto) argIntFrame).setValueSearch(valor, comp);
                }
            }
            
            dispose();
        }
    }
    
    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == btn_buscardocumento) {
            cargarTabla();
        }
        
        if (cbCancel == e.getSource()) {
            dispose();
        }
        
        if (e.getSource() == btn_Agregar) {
            obtenerDatos();
        }
    }
    
    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }
        
        if (e.getKeyCode() == KeyEvent.VK_F5) {
            cargarTabla();
        }
        
        if (e.getKeyChar() == '\n') {
            if (txt_idanexo == e.getSource()) {
                txt_descripcion.requestFocus();
            }
            
            if (txt_descripcion == e.getSource()) {
                txt_ruc.requestFocus();
            }
            
            if (txt_ruc == e.getSource()) {
                btn_buscardocumento.requestFocus();
            }
            
            if (btn_buscardocumento == e.getSource()) {
                if (tblSearch.getRowCount() > 0) {
                    tblSearch.setRowSelectionInterval(0, 0);
                    tblSearch.requestFocus();
                } else {
                    cbCancel.requestFocus();
                }
            }
        }
    }
    
    public void cargarTabla() {
        try {
            RnAnexo regla = new RnAnexo(path);
            modeltblSearch.clearTable();
            Anexo a = new Anexo();
            a.setIdAnexo(txt_idanexo.getText().trim());
            a.setIdTipoAnexo(an.getIdTipoAnexo());
            a.setDescripcion(txt_descripcion.getText().trim());
            a.setNumerodoc(txt_ruc.getText().trim());
            a.setTasadescuento(-1);
            a.setIdEmpresa(an.getIdEmpresa());
            a.setNumeroInicial(-1);
            a.setNumeroFinal(-1);
            modeltblSearch.agregarVectorAnexo(regla.listarAnexo(a));
            tblSearch.setAllColumnPreferredWidth();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }
    
    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_descripcion) {
            txt_descripcion.selectAll();
        }
        
        if (e.getSource() == txt_ruc) {
            txt_ruc.selectAll();
        }
        
        if (e.getSource() == txt_idanexo) {
            txt_idanexo.selectAll();
        }
    }
    
    @Override
    public void windowClosing(WindowEvent e) {
        dispose();
    }
    
    @Override
    public void windowOpened(WindowEvent e) {
        txt_descripcion.requestFocus();
    }
    
    public void loadVendedor() {
        try {
            Anexo a = new Anexo();
            a.setIdTipoAnexo("8");
            a.setNumeroInicial(-1);
            a.setNumeroFinal(-1);
            a.setIdEmpresa(an.getIdEmpresa());
            
            RnAnexo regla_TipoDocIden = new RnAnexo(path);
            
            
            if (xclasificacion != null) {
                xclasificacion.clear();
            } else {
                xclasificacion = new ArrayList<Anexo>();
            }
            
            xclasificacion = regla_TipoDocIden.listarAnexo(a);
            
            cb_clasificacion.removeAllItems();
            cb_clasificacion.addItem("--- SELECCIONE VENDEDOR ---");
            
            for (int i = 0; i < xclasificacion.size(); i++) {
                cb_clasificacion.addItem(xclasificacion.get(i).getDescripcion());
            }
            
            cb_clasificacion.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }
    
    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_idanexo && txt_idanexo.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_idanexo.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());
            
            txt_idanexo.setText(nuevaserie);
        }
    }
    
    @Override
    public void keyReleased(KeyEvent e) {
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
    
    public JTabbedPane getTabSearch() {
        return tabSearch;
    }
}
