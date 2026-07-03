/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiactualizaralmacenes;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.Stock;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.general.controles.CDialog;
import com.softcommerce.general.controles.JHInternal;
import java.beans.PropertyChangeEvent;
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
import com.softcommerce.general.controles.CComboBox;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.IntegerDocument;
import java.awt.event.FocusListener;
import java.awt.event.ItemListener;
import java.awt.event.MouseListener;
import java.beans.PropertyChangeListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JComponent;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.KeyStroke;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.reglasnegocio.RnStock;
import com.softcommerce.general.tablas.ActualizarAlmacenesTableModel;
import com.softcommerce.general.herramientas.DateTime;

public class UiActualizarAlmacenes extends CDialog implements InterUiActualizarAlmacenes, ActionListener, KeyListener, WindowListener, ItemListener, FocusListener, MouseListener, PropertyChangeListener {

    protected List<UsuarioCorrelativo> x_serie;
    private static final long serialVersionUID = 1L;
    protected JTabbedPane tabSearch;
    protected ActualizarAlmacenesTableModel modeltable;
    protected CTable tblSearch;
    protected JScrollPane scrollSearch;
    protected JButton btn_actualizar;
    protected JButton cbCancel;
    protected JButton btn_buscardocumento;
    protected JButton btn_cambiaralmacen;
    protected JComboBox cbo_idtipodoc;
    protected JComboBox cbo_serie;
    protected JTextField txt_preimpreso;
    protected Usuario usuario;
    protected List<Stock> xAlmacenPartida;
    protected CComboBox cboAlmacenPartida;
    protected JDialog dialog;
    protected Gif gif;
    protected JFrame frame;

    public UiActualizarAlmacenes(JFrame arg0, JHInternal pnlguia, Usuario usuario, java.net.URL path) {
        super(arg0);
        this.path = path;
        this.frame = arg0;
        this.usuario = usuario;
        initialize();
    }

    public UiActualizarAlmacenes(Frame arg0, JHInternalFrame pnlguia, Usuario usuario, java.net.URL path) {
        super(arg0);
        this.path = path;
        this.usuario = usuario;
        initialize();
    }

    public UiActualizarAlmacenes(Frame arg0, Usuario usuario, java.net.URL path) {
        super(arg0);
        this.path = path;
        this.usuario = usuario;
        initialize();
    }

    public UiActualizarAlmacenes(Frame arg0, JHInternalDialog arg1, java.net.URL path) {
        super(arg0);
        this.path = path;
        initialize();
    }

    protected void initialize() {
        addWindowListener(this);

        gif = new Gif();

        JPanel pnl = new JPanel();
        pnl.setBackground(new Color(243, 248, 252));
        pnl.setOpaque(false);
        pnl.setLayout(null);

        JLabel lblSerie = new JLabel("Doc");
        lblSerie.setBounds(5, 5, 30, 20);
        pnl.add(lblSerie);

        cbo_idtipodoc = new JComboBox();
        cbo_idtipodoc.setBounds(35, 5, 160, 20);
        cbo_idtipodoc.addItem("BOLETA");
        cbo_idtipodoc.addItem("FACTURA");
        cbo_idtipodoc.addActionListener(this);
        cbo_idtipodoc.addKeyListener(this);
        pnl.add(cbo_idtipodoc);

        cbo_serie = new JComboBox();
        cbo_serie.setBounds(200, 5, 53, 20);
        cbo_serie.addActionListener(this);
        cbo_serie.addKeyListener(this);
        pnl.add(cbo_serie);

        txt_preimpreso = new JTextField();
        txt_preimpreso.setBounds(262, 5, 80, 20);
        txt_preimpreso.addKeyListener(this);
        txt_preimpreso.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_preimpreso.addFocusListener(this);
        txt_preimpreso.setDocument(new IntegerDocument(10));
        txt_preimpreso.setForeground(Color.BLACK);
        pnl.add(txt_preimpreso);

        btn_buscardocumento = new JButton("F5", gif.SEARCH16);
        btn_buscardocumento.setBounds(352, 5, 70, 20);
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

        btn_cambiaralmacen = new JButton("Cambiar almacen", gif.DETAIL16);
        btn_cambiaralmacen.setBounds(434, 5, 140, 20);
        btn_cambiaralmacen.setMnemonic('Q');
        btn_cambiaralmacen.setFont(new Font(Font.SANS_SERIF, 0, 11));
        btn_cambiaralmacen.setOpaque(false);
        btn_cambiaralmacen.setIconTextGap(10);
        btn_cambiaralmacen.setToolTipText("Cambiar Almacen");
        btn_cambiaralmacen.setHorizontalAlignment(SwingConstants.LEFT);
        btn_cambiaralmacen.setContentAreaFilled(true);
        btn_cambiaralmacen.setBorderPainted(true);
        btn_cambiaralmacen.setFocusable(true);
        btn_cambiaralmacen.setFocusPainted(false);
        btn_cambiaralmacen.addFocusListener(this);
        btn_cambiaralmacen.addActionListener(this);
        btn_cambiaralmacen.addKeyListener(this);
        btn_cambiaralmacen.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        pnl.add(btn_cambiaralmacen);

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

        btn_actualizar = new JButton("Actualizar", gif.MODIFY16);
        btn_actualizar.setMnemonic('B');
        btn_actualizar.setHorizontalAlignment(SwingConstants.LEFT);
        btn_actualizar.setIconTextGap(10);
        btn_actualizar.addActionListener(this);
        btn_actualizar.setFont(new Font("Verdana", 1, 10));
        btn_actualizar.setOpaque(false);
        btn_actualizar.addKeyListener(this);
        btn_actualizar.setFocusPainted(false);
        btn_actualizar.setBounds(475, 280, 120, 25);
        pnl.add(btn_actualizar);

        modeltable = new ActualizarAlmacenesTableModel();
        tblSearch = new CTable();
        tblSearch.setModel(modeltable);
        tblSearch.setAllTableNoEditable();
        tblSearch.setAllColumnNoResizable();
        tblSearch.setAllColumnPreferredWidth();
        tblSearch.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                obtenerDatos();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);
        tblSearch.addKeyListener(this);
        tblSearch.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                }
            }
        });
        scrollSearch = new JScrollPane(tblSearch, JScrollPane.VERTICAL_SCROLLBAR_ALWAYS, JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS);
        scrollSearch.setBounds(5, 30, 590, 245);
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

        loadSerie(cbo_idtipodoc.getSelectedItem().toString().equals("BOLETA") ? "03" : "01");

        setBackground(new Color(245, 245, 245));
        setTitle("Actualizar Almacenes de Documento de Venta - Actualiazar Almacen");
        setContentPane(tabSearch);
        setModal(true);
        setResizable(false);
        setSize(620, 380);
        ComponentToolKit.centerComponentPosicion(this);
    }

    protected void loadSerie(String id_tipo_doc) {
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_preimpreso) {
            txt_preimpreso.selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
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
    }

    public void cambiarAlmacen() {
    }

    public String executeUpdate() {
        return null;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (btn_cambiaralmacen == e.getSource()) {
            cambiarAlmacen();
        }

        if (e.getSource() == btn_buscardocumento) {
            if (txt_preimpreso.getText().trim().length() == 10) {
                cargarTabla();
            } else {
                JOptionPane.showMessageDialog(this, "Para buscar items pendientes de salida, debes especificar \nel numero de documento" + ".", "Datos incompletos de Busqueda.", JOptionPane.INFORMATION_MESSAGE);
            }
        }

        if (cbCancel == e.getSource()) {
            dispose();
        }

        if (cbo_idtipodoc == e.getSource()) {
            if (cbo_idtipodoc.getItemCount() > 0) {
                loadSerie(cbo_idtipodoc.getSelectedItem().toString().equals("BOLETA") ? "03" : "01");
            }
        }

        if (e.getSource() == btn_actualizar) {
            obtenerDatos();
        }
    }

    public void cargarTabla() {
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
                cbo_serie.requestFocus();
            }

            if (cbo_serie == e.getSource()) {
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
}