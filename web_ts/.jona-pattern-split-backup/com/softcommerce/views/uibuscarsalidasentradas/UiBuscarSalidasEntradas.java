/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uibuscarsalidasentradas;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CDialog;
import com.softcommerce.general.controles.JHInternal;
import java.beans.PropertyChangeEvent;
import java.util.logging.Logger;
import com.softcommerce.general.tablas.BuscarDocumentoTableModel;
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
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTextField;
import javax.swing.SwingConstants;
import javax.swing.border.EmptyBorder;
import com.softcommerce.general.controles.JHInternalDialog;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.IntegerDocument;
import java.awt.event.FocusListener;
import java.awt.event.ItemListener;
import java.awt.event.MouseListener;
import java.beans.PropertyChangeListener;
import javax.swing.JComponent;
import javax.swing.KeyStroke;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.util.FormatObject;

public class UiBuscarSalidasEntradas extends CDialog implements InterUiBuscarSalidasEntradas, ActionListener, KeyListener, WindowListener, ItemListener, FocusListener, MouseListener, PropertyChangeListener {

    private static final long serialVersionUID = 1L;
    private JHInternalDialog ari;
    private Component comp;

    private int indiceTabla;

    private JTabbedPane tabSearch;
    private BuscarDocumentoTableModel modeltblSearch;
    private CTable tblSearch;
    private JScrollPane scrollSearch;

    private JButton btn_Agregar;
    private JButton cbCancel;
    private JButton btn_buscardocumento;

    private JComboBox cbo_idtipodoc;

    private JTextField txt_serie;
    private JTextField txt_preimpreso;

    private RegisterGuiaRemision pnlguia;

    private JHInternal arg;

    private Usuario usuario;

    public UiBuscarSalidasEntradas(Frame arg0, JHInternal pnlguia, Usuario usuario, java.net.URL path) {
        super(arg0);
        this.path = path;
        this.arg = pnlguia;
        this.usuario = usuario;
        initialize();
    }

    public UiBuscarSalidasEntradas(Frame arg0, JHInternalFrame pnlguia, Usuario usuario, java.net.URL path) {
        super(arg0);
        this.path = path;
        this.usuario = usuario;
        initialize();
    }

    public UiBuscarSalidasEntradas(Frame arg0, JHInternalDialog arg1, java.net.URL path) {
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

        JLabel lblSerie = new JLabel("T Documento");
        lblSerie.setBounds(5, 5, 70, 20);
        pnl.add(lblSerie);

        cbo_idtipodoc = new JComboBox();
        cbo_idtipodoc.setBounds(80, 5, 160, 20);
        cbo_idtipodoc.addItem("BOLETA");
        cbo_idtipodoc.addItem("FACTURA");
        cbo_idtipodoc.addItem("GUIA DE REMISION");
        cbo_idtipodoc.addItem("ORDEN DE RECOJO");
        cbo_idtipodoc.addActionListener(this);
        cbo_idtipodoc.addKeyListener(this);
        pnl.add(cbo_idtipodoc);

        txt_serie = new JTextField();
        txt_serie.setBounds(245, 5, 30, 20);
        txt_serie.addKeyListener(this);
        txt_serie.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_serie.addFocusListener(this);
        FormatObject.formatJTextFieldSerie(txt_serie);
        txt_serie.setForeground(Color.BLACK);
        pnl.add(txt_serie);

        txt_preimpreso = new JTextField();
        txt_preimpreso.setBounds(280, 5, 80, 20);
        txt_preimpreso.addKeyListener(this);
        txt_preimpreso.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_preimpreso.addFocusListener(this);
        txt_preimpreso.setDocument(new IntegerDocument(10));
        txt_preimpreso.setForeground(Color.BLACK);
        pnl.add(txt_preimpreso);

        btn_buscardocumento = new JButton("F5", gif.SEARCH16);
        btn_buscardocumento.setBounds(370, 5, 70, 20);
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
        cbCancel.setBounds(5, 280, 120, 25);
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
        btn_Agregar.setBounds(325, 280, 120, 25);
        pnl.add(btn_Agregar);

        modeltblSearch = new BuscarDocumentoTableModel();
        tblSearch = new CTable();
        tblSearch.setModel(modeltblSearch);
        tblSearch.setAllTableNoEditable();
        tblSearch.setAllColumnNoResizable();

        tblSearch.setNoVisibleColumn(3);
        tblSearch.setNoVisibleColumn(4);
        tblSearch.setNoVisibleColumn(5);

        tblSearch.setAllColumnPreferredWidth();
        tblSearch.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                obtenerDatos();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);

        scrollSearch = new JScrollPane(tblSearch, JScrollPane.VERTICAL_SCROLLBAR_ALWAYS, JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS);
        scrollSearch.setBounds(5, 30, 440, 245);
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

        tabSearch = new JTabbedPane();
        tabSearch.setFocusable(false);
        tabSearch.add("Documentos", pnl);
        tabSearch.setBorder(new EmptyBorder(5, 5, 5, 5));
        tabSearch.setBackground(new Color(243, 248, 252));

        setBackground(new Color(245, 245, 245));
        setTitle("Buscar Documento de Venta");
        setContentPane(tabSearch);
        setModal(true);
        setResizable(false);
        setSize(470, 380);
        ComponentToolKit.centerComponentPosicion(this);
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_serie) {
            txt_serie.selectAll();
        }

        if (e.getSource() == txt_preimpreso) {
            txt_preimpreso.selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource().equals(txt_serie)) {
            FormatObject.formatSerie((JTextField) e.getSource());
        }
        if (e.getSource() == txt_preimpreso && txt_preimpreso.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_preimpreso.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txt_preimpreso.setText(nuevaserie);
        }
    }

    @Override
    public void windowOpened(WindowEvent e) {
        cbo_idtipodoc.requestFocus();
    }

    @Override
    public void windowClosing(WindowEvent e) {
        dispose();
    }

    public void mostrar() {
        ComponentToolKit.centerComponentPosicion(this);
        cbo_idtipodoc.requestFocus();
        setVisible(true);
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

    public void cargarTabla() {
        ContaCab m = new ContaCab();
        m.setIdLocalidad(usuario.getCodlocalidad());
        m.setIdPuntoventa(usuario.getCodpuntoventa());
        m.setIdEmpresa(usuario.getCodempresa());
        m.setSerie(txt_serie.getText().trim());
        m.setPreimpreso(txt_preimpreso.getText().trim());
        m.setIdTipoDoc(cbo_idtipodoc.getSelectedItem().equals("ORDEN DE RECOJO") ? "OR" : (cbo_idtipodoc.getSelectedItem().equals("FACTURA") ? "01" : (cbo_idtipodoc.getSelectedItem().equals("BOLETA") ? "03" : (cbo_idtipodoc.getSelectedItem().equals("GUIA DE REMISION") ? "09" : ""))));
        RnRegContaCab regla = new RnRegContaCab(path);
        modeltblSearch.clearTable();
        modeltblSearch.agregarVectorMovInventarioCab(regla.listarDocumentos(m));
        tblSearch.setAllColumnPreferredWidth();
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
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
            if (cbo_idtipodoc == e.getSource()) {
                txt_serie.requestFocus();
            }

            if (txt_serie == e.getSource()) {
                txt_preimpreso.requestFocus();
            }

            if (txt_preimpreso == e.getSource()) {
                if (tblSearch.getRowCount() > 0) {
                    tblSearch.setRowSelectionInterval(0, 0);
                    tblSearch.requestFocus();
                } else {
                    cbCancel.requestFocus();
                }
            }
        }
    }

    public void obtenerDatos() {
        int row = tblSearch.getSelectedRow();

        if (row >= 0) {
            Object valor = tblSearch.getValueAt(row, indiceTabla);

            if (arg != null) {
                arg.setValueSearch(valor.toString().trim(), comp);
            }

            if (ari != null) {
                ari.setValueSearch(valor.toString().trim(), comp);
            }

            if (pnlguia != null) {
                pnlguia.setValueSearch(valor.toString().trim(), comp);
            }

            dispose();
        }
    }

    @Override
    public void propertyChange(PropertyChangeEvent evt) {
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
    private static final Logger LOG = Logger.getLogger(UiBuscarSalidasEntradas.class.getName());
}
