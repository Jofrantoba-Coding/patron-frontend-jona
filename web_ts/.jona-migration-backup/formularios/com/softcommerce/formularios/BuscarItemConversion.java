package com.softcommerce.formularios;

import com.softcommerce.beans.BeanFamilia;
import com.softcommerce.beans.BeanItem;
import com.softcommerce.beans.BeanMarca;
import com.softcommerce.beans.BeanSubFamilia;
import com.softcommerce.general.controles.JHDialog;
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
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.ItemTableModel;
import java.awt.event.FocusListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JComponent;
import javax.swing.KeyStroke;
import javax.swing.RowFilter;
import javax.swing.table.TableRowSorter;
import com.softcommerce.reglasnegocio.RnFamilia;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.reglasnegocio.RnMarca;
import com.softcommerce.reglasnegocio.RnSubFamilia;
import com.softcommerce.util.Constans;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.math.BigDecimal;
import javax.swing.JOptionPane;
import java.net.URL;

public class BuscarItemConversion 
        extends JDialog 
        implements ActionListener, KeyListener, WindowListener, FocusListener {

    private Component comp;
    private String id_empresa;
    private int indiceTabla;
    private JTabbedPane tabSearch;
    private ItemTableModel modeltable;
    private TableRowSorter tablesorter;
    private CTable table;
    private JScrollPane scrollSearch;
    private JButton btn_Refrescar;
    private JButton btn_Agregar;
    private JButton cbCancel;
    private JTextField txt_CodigoItem;
    private JTextField txt_CodigoAlterno;
    private JTextField txtItem;
    private JTextField txt_valor;
    private JTextField txtValorOrigen;
    private JTextField txt_valor_paq;
    private List<BeanFamilia> xfamilia;
    private JComboBox cbFamilia;
    private List<BeanSubFamilia> xsubfamilia;
    private JComboBox cbSubFamiliaFiltro;
    private List<BeanMarca> xmarca;
    private JComboBox cb_MarcaFiltro;
    private final JHDialog ari2;
    private final URL path;

    public BuscarItemConversion(Frame arg0, JHDialog arg1, URL path) {
        super(arg0);
        this.path = path;
        this.ari2 = arg1;
        initialize();
    }

    private JPanel getPnlPrincipal() {
        JPanel pnl = new JPanel();
        pnl.setBackground(new Color(243, 248, 252));
        pnl.setOpaque(false);
        pnl.setLayout(new BorderLayout());

        pnl.add(this.getPnlNorth(), BorderLayout.NORTH);
        pnl.add(this.getPnlCenter(), BorderLayout.CENTER);
        pnl.add(this.getPnlSouth(), BorderLayout.SOUTH);
        return pnl;
    }

    private JPanel getPnlNorth() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnlPrinc.add(pnl, BorderLayout.WEST);
        pnl.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.anchor = GridBagConstraints.WEST;
        gbc.insets = new Insets(2, 2, 2, 2);
        JLabel lbl_CodigoItem = new JLabel("Código");
        lbl_CodigoItem.setFont(new Font("Verdana", 0, 11));
        pnl.add(lbl_CodigoItem, gbc);

        gbc.gridx = 1;
        txt_CodigoItem = new JTextField();
        txt_CodigoItem.addKeyListener(this);
        txt_CodigoItem.setDocument(new IntegerDocument(6));
        txt_CodigoItem.addFocusListener(this);
        txt_CodigoItem.setFont(new Font("Garamond", 0, 14));
        txt_CodigoItem.setColumns(6);
        pnl.add(txt_CodigoItem, gbc);

        gbc.gridx = 2;
        JLabel lbl_CodigoAlterno = new JLabel("Código Alt.");
        lbl_CodigoAlterno.setFont(new Font("Verdana", 0, 11));
        pnl.add(lbl_CodigoAlterno, gbc);

        gbc.gridx = 3;
        txt_CodigoAlterno = new JTextField();
        txt_CodigoAlterno.addFocusListener(this);
        txt_CodigoAlterno.addKeyListener(this);
        txt_CodigoAlterno.setDocument(new IntegerDocument(6));
        txt_CodigoAlterno.setFont(new Font("Garamond", 0, 14));
        txt_CodigoAlterno.setColumns(6);
        pnl.add(txt_CodigoAlterno, gbc);

        gbc.gridx = 4;
        JLabel lblItem = new JLabel("Desc.");
        lblItem.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblItem, gbc);

        gbc.gridx = 5;
        txtItem = new JTextField();
        txtItem.addFocusListener(this);
        txtItem.setFont(new Font("Garamond", 0, 14));
        txtItem.setDocument(new UpperCaseNumberDocument(255));
        txtItem.addKeyListener(this);
        txtItem.setColumns(20);
        pnl.add(txtItem, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lbl_familia = new JLabel("Familia");
        lbl_familia.setFont(new Font("Verdana", 0, 11));
        pnl.add(lbl_familia, gbc);

        gbc.gridx = 1;
        cbFamilia = new JComboBox();
        cbFamilia.addActionListener(this);
        cbFamilia.addKeyListener(this);
        pnl.add(cbFamilia, gbc);

        gbc.gridx = 2;
        JLabel lbl_subfamilia = new JLabel("SubFamilia");
        lbl_subfamilia.setFont(new Font("Verdana", 0, 11));
        pnl.add(lbl_subfamilia, gbc);

        gbc.gridx = 3;
        cbSubFamiliaFiltro = new JComboBox();
        cbSubFamiliaFiltro.addActionListener(this);
        cbSubFamiliaFiltro.setEnabled(false);
        cbSubFamiliaFiltro.addKeyListener(this);
        pnl.add(cbSubFamiliaFiltro, gbc);

        gbc.gridx = 4;
        JLabel lblMarca = new JLabel("Marca");
        lblMarca.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblMarca, gbc);

        gbc.gridx = 5;
        cb_MarcaFiltro = new JComboBox();
        cb_MarcaFiltro.addKeyListener(this);
        cb_MarcaFiltro.addActionListener(this);
        pnl.add(cb_MarcaFiltro, gbc);
        return pnlPrinc;
    }

    private JPanel getPnlCenter() {
        JPanel pnl = new JPanel();
        modeltable = new ItemTableModel();
        tablesorter = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(tablesorter);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();

        table.setAllColumnPreferredWidth();
        KeyStroke keystroke4 = KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false);
        ActionListener action4 = new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                obtenerDatos();
            }
        };
        table.registerKeyboardAction(action4, keystroke4, JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);

        scrollSearch = new JScrollPane(table, JScrollPane.VERTICAL_SCROLLBAR_ALWAYS, JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS);
        scrollSearch.setPreferredSize(new Dimension(855, 245));
        pnl.add(scrollSearch, BorderLayout.CENTER);

        table.setNoVisibleColumn(8);
        table.setNoVisibleColumn(10);
        table.setNoVisibleColumn(12);
        table.setNoVisibleColumn(14);

        table.addKeyListener(this);
        table.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                    obtenerDatos();
                }
            }
        });
        JPanel pnlOpc = new JPanel(new FlowLayout(FlowLayout.LEADING, 5, 5));
        pnl.add(pnlOpc, BorderLayout.SOUTH);
        JLabel lbl_valor = new JLabel("VALOR DE CONVERSION ");
        lbl_valor.setForeground(Color.red);
        lbl_valor.setFont(new Font("Verdana", 1, 11));
        pnlOpc.add(lbl_valor);

        txt_valor = new JTextField();
        txt_valor.addKeyListener(this);
        txt_valor.setDocument(new DoubleDocument());
        txt_valor.addFocusListener(this);
        txt_valor.setFont(new Font("Garamond", 1, 14));
        txt_valor.setColumns(5);
        pnlOpc.add(txt_valor);

        JLabel lbl_valor_paq = new JLabel("VALOR DE PAQUETE ");
        lbl_valor_paq.setForeground(Color.red);
        lbl_valor_paq.setFont(new Font("Verdana", 1, 11));
        pnlOpc.add(lbl_valor_paq);

        txt_valor_paq = new JTextField();
        txt_valor_paq.addKeyListener(this);
        txt_valor_paq.setDocument(new DoubleDocument());
        txt_valor_paq.addFocusListener(this);
        txt_valor_paq.setColumns(5);
        txt_valor_paq.setFont(new Font("Garamond", 1, 14));
        pnlOpc.add(txt_valor_paq);
        JLabel lblValorOrigen = new JLabel("VALOR DE ORIGEN");
        lblValorOrigen.setForeground(Color.red);
        lblValorOrigen.setFont(new Font("Verdana", 1, 11));
        pnlOpc.add(lblValorOrigen);

        txtValorOrigen = new JTextField();
        txtValorOrigen.addKeyListener(this);
        txtValorOrigen.setDocument(new DoubleDocument());
        txtValorOrigen.addFocusListener(this);
        txtValorOrigen.setColumns(5);
        txtValorOrigen.setFont(new Font("Garamond", 1, 14));
        pnlOpc.add(txtValorOrigen);
        return pnl;
    }

    private JPanel getPnlSouth() {
        Gif gif = new Gif();
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        cbCancel = new JButton("Cancelar", gif.CANCEL16);
        cbCancel.setMnemonic('C');
        cbCancel.setHorizontalAlignment(SwingConstants.LEFT);
        cbCancel.setIconTextGap(10);
        cbCancel.addActionListener(this);
        cbCancel.setFont(new Font("Verdana", 1, 10));
        cbCancel.setOpaque(false);
        cbCancel.addKeyListener(this);
        cbCancel.setFocusPainted(false);
        pnl.add(cbCancel, BorderLayout.WEST);

        JPanel pnlEast = new JPanel();
        pnlEast.setLayout(new BorderLayout());
        pnl.add(pnlEast, BorderLayout.EAST);
        btn_Refrescar = new JButton("Refrescar", gif.REFRESH16);
        btn_Refrescar.setMnemonic('B');
        btn_Refrescar.setHorizontalAlignment(SwingConstants.LEFT);
        btn_Refrescar.setIconTextGap(10);
        btn_Refrescar.addActionListener(this);
        btn_Refrescar.setFont(new Font("Verdana", 1, 10));
        btn_Refrescar.setOpaque(false);
        btn_Refrescar.addKeyListener(this);
        btn_Refrescar.setFocusPainted(false);
        pnlEast.add(btn_Refrescar);

        btn_Agregar = new JButton("Agregar", gif.ADD16);
        btn_Agregar.setMnemonic('B');
        btn_Agregar.setHorizontalAlignment(SwingConstants.LEFT);
        btn_Agregar.setIconTextGap(10);
        btn_Agregar.addActionListener(this);
        btn_Agregar.setFont(new Font("Verdana", 1, 10));
        btn_Agregar.setOpaque(false);
        btn_Agregar.addKeyListener(this);
        btn_Agregar.setFocusPainted(false);
        pnlEast.add(btn_Agregar);
        return pnl;
    }

    private void initialize() {
        addWindowListener(this);
        tabSearch = new JTabbedPane();
        tabSearch.setFocusable(false);
        tabSearch.add("Item", this.getPnlPrincipal());
        tabSearch.setBorder(new EmptyBorder(5, 5, 5, 5));
        tabSearch.setBackground(new Color(243, 248, 252));

        setBackground(new Color(245, 245, 245));
        setContentPane(tabSearch);
        setModal(true);
        setResizable(false);
        setSize(915, 475);
        setTitle("Item a convertir");
        ComponentToolKit.centerComponentPosicion(this);
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txtItem)
                    || (e.getSource() == txt_CodigoAlterno)
                    || (e.getSource() == txt_CodigoItem)) {
                filtrar();
            }
        }
    }

    public void filtrar() {
        tablesorter.setRowFilter(getFilter());
        table.setAllColumnPreferredWidth();

        if (table.getRowCount() > 0) {
            table.setRowSelectionInterval(0, 0);
        }
    }

    public RowFilter getFilter() {
        List filters = new ArrayList();

        if (txt_CodigoItem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_CodigoItem.getText().trim() + ".*", 1));
        }

        if (txt_CodigoAlterno.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_CodigoAlterno.getText().trim() + ".*", 2));
        }

        if (txtItem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtItem.getText().trim() + ".*", 3));
        }

        if (cbFamilia.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xfamilia.get(cbFamilia.getSelectedIndex() - 1).getIdFamilia() + ".*", 8));
        }

        if (cb_MarcaFiltro.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xmarca.get(cb_MarcaFiltro.getSelectedIndex() - 1).getIdMarca() + ".*", 12));
        }

        if (cbSubFamiliaFiltro.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xsubfamilia.get(cbSubFamiliaFiltro.getSelectedIndex() - 1).getIdSubFamilia() + ".*", 10));
        }

        RowFilter fooBarFilter = RowFilter.andFilter(filters);

        return fooBarFilter;
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }

        if (e.getKeyChar() == '\n') {
            if (txt_CodigoItem == e.getSource()) {
                txt_CodigoAlterno.requestFocus();
            }

            if (txt_CodigoAlterno == e.getSource()) {
                txtItem.requestFocus();
            }

            if (txtItem == e.getSource()) {
                cbFamilia.requestFocus();
            }

            if (cbFamilia == e.getSource()) {
                cbSubFamiliaFiltro.requestFocus();
            }

            if (cbSubFamiliaFiltro == e.getSource()) {
                cb_MarcaFiltro.requestFocus();
            }

            if (cb_MarcaFiltro == e.getSource()) {
                if (table.getRowCount() > 0) {
                    table.setRowSelectionInterval(0, 0);
                    table.requestFocus();
                } else {
                    cbCancel.requestFocus();
                }
            }
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txtItem) {
            txtItem.selectAll();
        }

        if (e.getSource() == txt_CodigoAlterno) {
            txt_CodigoAlterno.selectAll();
        }

        if (e.getSource() == txt_CodigoItem) {
            txt_CodigoItem.selectAll();
        }

        if (e.getSource() == txt_valor) {
            txt_valor.selectAll();
        }

        if (e.getSource() == txt_valor_paq) {
            txt_valor_paq.selectAll();
        }
        if (e.getSource() == txtValorOrigen) {
            txtValorOrigen.selectAll();
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == btn_Refrescar) {
            cargarTabla(id_empresa, comp, indiceTabla);
        }

        if (cbCancel == e.getSource()) {
            dispose();
        }

        if (e.getSource() == btn_Agregar) {
            obtenerDatos();
        }

        if (cbFamilia == e.getSource()) {
            if (cbFamilia.getItemCount() > 0) {
                if (cbFamilia.getSelectedIndex() == 0) {
                    cbSubFamiliaFiltro.removeAllItems();
                    cbSubFamiliaFiltro.setEnabled(false);
                } else {
                    cbSubFamiliaFiltro.setEnabled(true);
                    loadSubFamilia(xfamilia.get(cbFamilia.getSelectedIndex() - 1).getIdFamilia());
                }
            }
        }

        if (e.getSource() == cbSubFamiliaFiltro) {
            if (cbSubFamiliaFiltro.getItemCount() > 0) {
                if (cbSubFamiliaFiltro.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }

        if (e.getSource() == cb_MarcaFiltro) {
            if (cb_MarcaFiltro.getItemCount() > 0) {
                if (cb_MarcaFiltro.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }

        if (e.getSource() == cbFamilia) {
            if (cbFamilia.getItemCount() > 0) {
                if (cbFamilia.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }
    }

    @Override
    public void windowOpened(WindowEvent e) {
        txtItem.requestFocus();
    }

    @Override
    public void windowClosing(WindowEvent e) {
        dispose();
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_valor && txt_valor.getText().trim().length() == 0) {
            txt_valor.setText("0.0");
        }

        if (e.getSource() == txt_valor_paq && txt_valor_paq.getText().trim().length() == 0) {
            txt_valor_paq.setText("0.0");
        }
        if (e.getSource() == txtValorOrigen && txtValorOrigen.getText().trim().length() == 0) {
            txtValorOrigen.setText("1.0");
        }
    }

    public void cargarTabla(
            String ls_id_empresa, Component ls_comp, int ls_indiceTabla) {
        try {
            txtItem.setText("");
            txt_CodigoAlterno.setText("");
            txt_CodigoItem.setText("");
            txt_valor.setText("0.0");
            txt_valor_paq.setText("0.0");
            txtValorOrigen.setText("1.0");

            this.id_empresa = ls_id_empresa;
            this.comp = ls_comp;
            this.indiceTabla = ls_indiceTabla;

            cargarCombo();

            tablesorter.setRowFilter(null);
            RnItem regla = new RnItem(path);
            modeltable.clearTable();
            modeltable.agregarListItem(regla.listItem(Constans.ESTADO_ACTIVO));

            table.setAllColumnPreferredWidth();

            ComponentToolKit.centerComponentPosicion(this);
            setVisible(true);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void cargarCombo() {
        loadMarca();
        loadFamilia();
    }

    public void loadMarca() {
        try {
            RnMarca regla_Marca = new RnMarca(path);
            if (xmarca != null) {
                xmarca.clear();
            } else {
                xmarca = new ArrayList();
            }
            xmarca.addAll(regla_Marca.listarGeneral(id_empresa));

            cb_MarcaFiltro.removeAllItems();
            cb_MarcaFiltro.addItem("--- Seleccione una Marca ---");

            for (int i = 0; i < xmarca.size(); i++) {
                cb_MarcaFiltro.addItem(xmarca.get(i).getDescripcion());
            }

            cb_MarcaFiltro.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadFamilia() {
        try {
            RnFamilia regla_Familia = new RnFamilia(path);

            if (xfamilia != null) {
                xfamilia.clear();
            } else {
                xfamilia = new ArrayList();
            }

            xfamilia.addAll(regla_Familia.listar("", "", id_empresa));

            cbFamilia.removeAllItems();
            cbFamilia.addItem("--- Seleccione una Familia ---");

            for (int i = 0; i < xfamilia.size(); i++) {
                cbFamilia.addItem(xfamilia.get(i).getDescripcion());
            }

            cbFamilia.setSelectedIndex(0);
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
            if (xsubfamilia != null) {
                xsubfamilia.clear();
            } else {
                xsubfamilia = new ArrayList();
            }

            xsubfamilia.addAll(regla_SubFamilia.listar(s));

            cbSubFamiliaFiltro.removeAllItems();
            cbSubFamiliaFiltro.addItem("--- Seleccione una SubFamilia ---");

            for (int i = 0; i < xsubfamilia.size(); i++) {
                cbSubFamiliaFiltro.addItem(xsubfamilia.get(i).getDescripcion());
            }

            cbSubFamiliaFiltro.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void obtenerDatos() {
        int row = table.getSelectedRow();

        if (row >= 0) {
            BeanItem item = modeltable.getItem(table.convertRowIndexToModel(row));
            item.setValorConversion(new BigDecimal(txt_valor.getText().trim()));
            item.setValorPaquete(new BigDecimal(txt_valor_paq.getText().trim()));
            item.setValorOrigen(new BigDecimal(txtValorOrigen.getText().trim()));
            if (ari2 != null) {
                ari2.setValueSearch(item, comp);
            }

            dispose();
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
