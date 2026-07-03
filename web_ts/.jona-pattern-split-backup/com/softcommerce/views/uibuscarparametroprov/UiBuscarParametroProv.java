/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uibuscarparametroprov;


import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.JHInternal;
import com.softcommerce.iconos.Gif;
import java.awt.Color;
import java.awt.Component;
import java.awt.Font;
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
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.event.FocusListener;
import java.awt.event.ItemListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.KeyStroke;
import javax.swing.RowFilter;
import javax.swing.table.TableRowSorter;
import com.softcommerce.reglasnegocio.RnParametroProv;
import com.softcommerce.general.tablas.ParametroProvTableModel;
import javax.swing.JOptionPane;

public class UiBuscarParametroProv extends JDialog implements InterUiBuscarParametroProv, ActionListener, KeyListener, WindowListener, ItemListener, FocusListener {

    private static final long serialVersionUID = 1L;
    private Component comp;
    private String id_empresa;
    private int indiceTabla;
    private JTabbedPane tabSearch;
    private ParametroProvTableModel modeltblSearch;
    private TableRowSorter<ParametroProvTableModel> modeloOrdenado;
    private CTable tblSearch;
    private JScrollPane scrollSearch;
    private JButton btn_Refrescar;
    private JButton btn_Agregar;
    private JButton cbCancel;
    private JTextField txt_descripcion;
    private JTextField txt_codigo;
    private JHInternal ards;
    private java.net.URL path;

    public UiBuscarParametroProv(JFrame frm, JHInternal arg1, java.net.URL path) {
        super(frm);
        this.path = path;
        this.ards = arg1;
        initialize();
    }

    private void initialize() {
        addWindowListener(this);

        Gif gif = new Gif();

        JPanel pnl = new JPanel();
        pnl.setBackground(new Color(243, 248, 252));
        pnl.setOpaque(false);
        pnl.setLayout(null);

        modeltblSearch = new ParametroProvTableModel();
        modeloOrdenado = new TableRowSorter<ParametroProvTableModel>(modeltblSearch);
        tblSearch = new CTable();
        tblSearch.setRowSorter(modeloOrdenado);
        tblSearch.setModel(modeltblSearch);
        tblSearch.setAllTableNoEditable();
        tblSearch.setAllColumnNoResizable();
        tblSearch.setAllColumnPreferredWidth();
        KeyStroke keystroke4 = KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false);
        ActionListener action4 = new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                obtenerDatos();
            }
        };
        tblSearch.registerKeyboardAction(action4, keystroke4, JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);

        scrollSearch = new JScrollPane(tblSearch, JScrollPane.VERTICAL_SCROLLBAR_ALWAYS, JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS);
        scrollSearch.setBounds(20, 65, 855, 245);
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

        txt_codigo = new JTextField();
        txt_codigo.setBounds(72, 25, 90, 20);
        txt_codigo.addKeyListener(this);
        txt_codigo.setDocument(new IntegerDocument(10));
        txt_codigo.addFocusListener(this);
        txt_codigo.setFont(new Font("Garamond", 0, 14));
        pnl.add(txt_codigo);

        JLabel lblRazonSocial = new JLabel("Descripción");
        lblRazonSocial.setBounds(217, 25, 100, 20);
        pnl.add(lblRazonSocial);

        txt_descripcion = new JTextField();
        txt_descripcion.setBounds(277, 25, 350, 20);
        txt_descripcion.addKeyListener(this);
        txt_descripcion.setDocument(new UpperCaseNumberDocument(255));
        txt_descripcion.addFocusListener(this);
        pnl.add(txt_descripcion);


        cbCancel = new JButton("Cancelar", gif.CANCEL16);
        cbCancel.setMnemonic('C');
        cbCancel.setHorizontalAlignment(SwingConstants.LEFT);
        cbCancel.setIconTextGap(10);
        cbCancel.addActionListener(this);
        cbCancel.setFont(new Font("Verdana", 1, 10));
        cbCancel.setOpaque(false);
        cbCancel.addKeyListener(this);
        cbCancel.setFocusPainted(false);
        cbCancel.setBounds(25, 320, 120, 25);
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
        btn_Refrescar.setBounds(600, 320, 120, 25);
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
        btn_Agregar.setBounds(740, 320, 120, 25);
        pnl.add(btn_Agregar);

        tabSearch = new JTabbedPane();
        tabSearch.setFocusable(false);
        tabSearch.add("Provisiones", pnl);
        tabSearch.setBorder(new EmptyBorder(5, 5, 5, 5));
        tabSearch.setBackground(new Color(243, 248, 252));

        setBackground(new Color(245, 245, 245));
        setContentPane(tabSearch);
        setModal(true);
        setResizable(false);
        setSize(915, 425);
        ComponentToolKit.centerComponentPosicion(this);
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txt_codigo)
                    || (e.getSource() == txt_descripcion)) {
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

    public RowFilter<Object, Object> getFilter() {
        List<RowFilter<Object, Object>> filters = new ArrayList<RowFilter<Object, Object>>();

        if (txt_codigo.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_codigo.getText().trim() + ".*", 0));
        }

        if (txt_descripcion.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_descripcion.getText().trim() + ".*", 1));
        }

        RowFilter<Object, Object> fooBarFilter = RowFilter.andFilter(filters);

        return fooBarFilter;
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }

        if (e.getKeyChar() == '\n') {
            if (txt_codigo == e.getSource()) {
                txt_descripcion.requestFocus();
            }

            if (txt_descripcion == e.getSource()) {
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
        if (e.getSource() == txt_codigo) {
            txt_codigo.selectAll();
        }

        if (e.getSource() == txt_descripcion) {
            txt_descripcion.selectAll();
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
    }

    @Override
    public void windowOpened(WindowEvent e) {
        txt_descripcion.requestFocus();
    }

    @Override
    public void windowClosing(WindowEvent e) {
        dispose();
    }

    @Override
    public void focusLost(FocusEvent e) {
    }

    public void cargarTabla(String ls_id_empresa, Component ls_comp, int ls_indiceTabla) {
        try {
            txt_codigo.setText("");
            txt_descripcion.setText("");

            this.id_empresa = ls_id_empresa;
            this.comp = ls_comp;
            this.indiceTabla = ls_indiceTabla;

            modeloOrdenado.setRowFilter(null);

            RnParametroProv regla = new RnParametroProv(path);
            modeltblSearch.clearTable();
            modeltblSearch.agregarVectorParametroProv(regla.listarParametroProv("", "C", "", "S", "", "", "A"));
            tblSearch.setAllColumnPreferredWidth();

            ComponentToolKit.centerComponentPosicion(this);
            setVisible(true);
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void obtenerDatos() {
        int row = tblSearch.getSelectedRow();

        if (row >= 0) {
            Object valor = tblSearch.getValueAt(row, indiceTabla);

            if (ards != null) {
                ards.setValueSearch(valor, comp);
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

    @Override
    public void itemStateChanged(ItemEvent e) {
    }
}