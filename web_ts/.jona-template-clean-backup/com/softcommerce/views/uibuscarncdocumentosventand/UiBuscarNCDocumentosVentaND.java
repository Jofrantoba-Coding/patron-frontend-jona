/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uibuscarncdocumentosventand;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.Usuario;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import com.softcommerce.general.controles.CDialog;
import com.softcommerce.general.controles.JHInternal;
import java.beans.PropertyChangeEvent;
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
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.event.FocusListener;
import java.awt.event.ItemListener;
import java.awt.event.MouseListener;
import java.beans.PropertyChangeListener;
import java.util.Date;
import java.util.List;
import javax.swing.JComponent;
import javax.swing.KeyStroke;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.util.FormatObject;
import javax.swing.JOptionPane;

public class UiBuscarNCDocumentosVentaND extends CDialog implements InterUiBuscarNCDocumentosVentaND, ActionListener, KeyListener, WindowListener, ItemListener, FocusListener, MouseListener, PropertyChangeListener {

    protected JTabbedPane tabb_documento;
    protected BuscarDocumentoTableModel mdl_documento;
    protected CTable tbl_documento;
    protected JScrollPane scp_documento;
    protected JButton btn_agregar;
    protected JButton btn_cancelar;
    protected JButton btn_buscar;
    protected JButton btn_nuevo;
    protected JComboBox cbo_idtipodoc;
    protected JComboBox cbo_idestado;
    protected JDateChooser dc_fechainicio;
    protected JDateChooser dc_fechafin;
    protected JTextField txt_tmpruc;
    protected JTextField txt_serie;
    protected JTextField txt_preimpreso;
    protected JTextField txt_tmpanexo;
    protected JTextField txt_idanexo;
    protected JTextField txt_idregconta;
    protected JHInternal arg;
    protected Component comp;
    protected Usuario usuario;
    protected java.net.URL path;

    //private Frame frame;
    public UiBuscarNCDocumentosVentaND(Frame arg0, JHInternal arg, Usuario usuario, java.net.URL path) {
        super(arg0);
        this.path = path;
        this.arg = arg;
        this.usuario = usuario;
        initialize();
    }

    protected void initialize() {
        addWindowListener(this);

        Gif gif = new Gif();

        JPanel pnl = new JPanel();
        pnl.setBackground(new Color(243, 248, 252));
        pnl.setOpaque(false);
        pnl.setLayout(null);

        mdl_documento = new BuscarDocumentoTableModel();
        tbl_documento = new CTable();
        tbl_documento.setModel(mdl_documento);
        tbl_documento.setAllTableNoEditable();
        tbl_documento.setAllColumnNoResizable();

        tbl_documento.setNoVisibleColumn(8);
        tbl_documento.setNoVisibleColumn(9);
        tbl_documento.setNoVisibleColumn(10);
        tbl_documento.setNoVisibleColumn(11);

        tbl_documento.setAllColumnPreferredWidth();
        tbl_documento.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                obtenerDatos();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);

        scp_documento = new JScrollPane(tbl_documento, JScrollPane.VERTICAL_SCROLLBAR_ALWAYS, JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS);
        scp_documento.setBounds(5, 70, 855, 245);
        pnl.add(scp_documento);

        tbl_documento.addKeyListener(this);
        tbl_documento.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                    obtenerDatos();
                }
            }
        });


        JLabel lblCodigoDespacho = new JLabel("Código");
        lblCodigoDespacho.setBounds(5, 5, 40, 20);
        lblCodigoDespacho.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblCodigoDespacho);

        txt_idregconta = new JTextField();
        txt_idregconta.setBounds(55, 5, 90, 20);
        txt_idregconta.addKeyListener(this);
        txt_idregconta.setDocument(new IntegerDocument(10));
        txt_idregconta.addFocusListener(this);
        txt_idregconta.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(txt_idregconta);

        JLabel lblSerie = new JLabel("N° Doc");
        lblSerie.setBounds(160, 5, 40, 20);
        pnl.add(lblSerie);

        cbo_idtipodoc = new JComboBox();
        cbo_idtipodoc.setBounds(200, 5, 40, 20);
        cbo_idtipodoc.addItem("T");
        cbo_idtipodoc.addItem("F");
        cbo_idtipodoc.addItem("B");
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

        JLabel lblRazonSocial = new JLabel("R Social");
        lblRazonSocial.setBounds(395, 5, 45, 20);
        pnl.add(lblRazonSocial);

        txt_idanexo = new JTextField();
        txt_idanexo.setBounds(440, 5, 80, 20);
        txt_idanexo.addKeyListener(this);
        txt_idanexo.addFocusListener(this);
        pnl.add(txt_idanexo);

        txt_tmpanexo = new JTextField();
        txt_tmpanexo.setBounds(523, 5, 315, 20);
        txt_tmpanexo.addKeyListener(this);
        txt_tmpanexo.setDocument(new UpperCaseNumberDocument(255));
        txt_tmpanexo.addFocusListener(this);
        pnl.add(txt_tmpanexo);

        JLabel lbl_RucCliente = new JLabel("RUC/DNI");
        lbl_RucCliente.setBounds(5, 35, 50, 20);
        pnl.add(lbl_RucCliente);

        txt_tmpruc = new JTextField();
        txt_tmpruc.setBounds(55, 35, 80, 20);
        txt_tmpruc.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_tmpruc.addFocusListener(this);
        txt_tmpruc.setDocument(new IntegerDocument(11));
        txt_tmpruc.addKeyListener(this);
        pnl.add(txt_tmpruc);

        cbo_idestado = new JComboBox();
        cbo_idestado.setBounds(541, 35, 50, 20);
        cbo_idestado.addItem("T");
        cbo_idestado.addItem("ATE");
        cbo_idestado.addItem("PAA");
        cbo_idestado.addItem("PEN");
        cbo_idestado.addActionListener(this);
        cbo_idestado.addKeyListener(this);
        pnl.add(cbo_idestado);

        dc_fechainicio = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).addFocusListener(this);
        dc_fechainicio.setBounds(210, 35, 90, 20);
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
        pnl.add(dc_fechainicio);

        JLabel lblFechaInicio = new JLabel("Fec Inicio");
        lblFechaInicio.setDisplayedMnemonic('c');
        lblFechaInicio.setLabelFor(dc_fechainicio);
        lblFechaInicio.setBounds(160, 35, 50, 20);
        pnl.add(lblFechaInicio);

        dc_fechafin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).addFocusListener(this);
        dc_fechafin.setBounds(370, 35, 90, 20);
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
                cbo_idestado.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dc_fechafin.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_fechafin.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        pnl.add(dc_fechafin);

        JLabel lblFechaFin = new JLabel("Fec Fin");
        lblFechaFin.setBounds(330, 35, 40, 20);
        lblFechaFin.setDisplayedMnemonic('a');
        lblFechaFin.setLabelFor(dc_fechafin);
        pnl.add(lblFechaFin);

        JLabel lbl_familia = new JLabel("Estado");
        lbl_familia.setFont(new Font("Verdana", 0, 11));
        lbl_familia.setBounds(492, 35, 50, 20);
        pnl.add(lbl_familia);

        btn_cancelar = new JButton("Cancelar", gif.CANCEL16);
        btn_cancelar.setMnemonic('C');
        btn_cancelar.setHorizontalAlignment(SwingConstants.LEFT);
        btn_cancelar.setIconTextGap(10);
        btn_cancelar.addActionListener(this);
        btn_cancelar.setFont(new Font("Verdana", 1, 10));
        btn_cancelar.setOpaque(false);
        btn_cancelar.addKeyListener(this);
        btn_cancelar.setFocusPainted(false);
        btn_cancelar.setBounds(5, 325, 120, 25);
        pnl.add(btn_cancelar);

        btn_agregar = new JButton("Agregar", gif.ADD16);
        btn_agregar.setMnemonic('B');
        btn_agregar.setHorizontalAlignment(SwingConstants.LEFT);
        btn_agregar.setIconTextGap(10);
        btn_agregar.addActionListener(this);
        btn_agregar.setFont(new Font("Verdana", 1, 10));
        btn_agregar.setOpaque(false);
        btn_agregar.addKeyListener(this);
        btn_agregar.setFocusPainted(false);
        btn_agregar.setBounds(740, 325, 120, 25);
        pnl.add(btn_agregar);

        tabb_documento = new JTabbedPane();
        tabb_documento.setFocusable(false);
        tabb_documento.add("Documentos", pnl);
        tabb_documento.setBorder(new EmptyBorder(5, 5, 5, 5));
        tabb_documento.setBackground(new Color(243, 248, 252));

        btn_nuevo = new JButton(gif.NEW16);
        btn_nuevo.setBounds(610, 35, 40, 20);
        btn_nuevo.setHorizontalTextPosition(SwingConstants.LEFT);
        btn_nuevo.setToolTipText("Filtrar");
        btn_nuevo.setContentAreaFilled(true);
        btn_nuevo.setBorderPainted(true);
        btn_nuevo.setFocusable(true);
        btn_nuevo.setFocusPainted(false);
        btn_nuevo.addActionListener(this);
        btn_nuevo.addKeyListener(this);
        btn_nuevo.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        pnl.add(this.btn_nuevo);

        btn_buscar = new JButton(gif.SEARCH16);
        btn_buscar.setBounds(655, 35, 40, 20);
        btn_buscar.setMnemonic('B');
        btn_buscar.setFont(new Font(Font.SANS_SERIF, 0, 9));
        btn_buscar.setOpaque(false);
        btn_buscar.setIconTextGap(10);
        btn_buscar.setToolTipText("Buscar Documento");
        btn_buscar.setContentAreaFilled(true);
        btn_buscar.setBorderPainted(true);
        btn_buscar.setFocusable(true);
        btn_buscar.setFocusPainted(false);
        btn_buscar.addFocusListener(this);
        btn_buscar.addActionListener(this);
        btn_buscar.addKeyListener(this);
        btn_buscar.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        pnl.add(this.btn_buscar);

        setBackground(new Color(245, 245, 245));
        //setTitle("Buscar Documentos de Venta con Productos Pendientes de Entrega");
        setTitle("Buscar Documentos de Venta");
        setContentPane(tabb_documento);
        setModal(true);
        setResizable(false);
        setSize(890, 420);
        ComponentToolKit.centerComponentPosicion(this);
    }

    public void limpiar() {
    }

    public void cargarTabla(Component ls_comp) {
    }

    public void cargarTabla() {
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_idregconta) {
            txt_idregconta.selectAll();
        }

        if (e.getSource() == ((JTextFieldDateEditor) dc_fechainicio.getDateEditor())) {
            ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).selectAll();
        }

        if (e.getSource() == ((JTextFieldDateEditor) dc_fechafin.getDateEditor())) {
            ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).selectAll();
        }

        if (e.getSource() == txt_tmpanexo) {
            txt_tmpanexo.selectAll();
        }

        if (e.getSource() == txt_idanexo) {
            txt_idanexo.selectAll();
        }

        if (e.getSource() == txt_tmpruc) {
            txt_tmpruc.selectAll();
        }

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

        if (e.getSource() == txt_idregconta && txt_idregconta.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_idregconta.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txt_idregconta.setText(nuevaserie);
        }

        if (e.getSource() == txt_idanexo && txt_idanexo.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_idanexo.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txt_idanexo.setText(nuevaserie);
        }

        if (e.getSource() == txt_preimpreso && txt_preimpreso.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_preimpreso.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txt_preimpreso.setText(nuevaserie);
        }
    }

    @Override
    public void windowOpened(WindowEvent e) {
        txt_preimpreso.requestFocus();
    }

    @Override
    public void windowClosing(WindowEvent e) {
        dispose();
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == btn_buscar) {
            cargarTabla();
        }

        if (e.getSource() == dc_fechainicio.getCalendarButton()) {
            dc_fechainicio.setSelectableDateRange(new Date(100, 0, 1), dc_fechafin.getDate());
        }

        if (e.getSource() == dc_fechafin.getCalendarButton()) {
            dc_fechafin.setSelectableDateRange(dc_fechainicio.getDate(), dc_fechafin.getMaxSelectableDate());
        }

        if (btn_cancelar == e.getSource()) {
            dispose();
        }

        if (e.getSource() == btn_nuevo) {
            limpiar();
        }

        if (e.getSource() == btn_agregar) {
            obtenerDatos();
        }
    }

    public boolean cargarCliente(String id_cliente) {
        return false;
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
            if (txt_tmpanexo == e.getSource()) {
                if (txt_tmpanexo.getText().trim().length() == 0) {
                    txt_tmpruc.requestFocus();
                } else {
                    BuscarCliente buscar_cliente = new BuscarCliente(this, path);
                    Anexo a = new Anexo();
                    a.setIdTipoAnexo("2");
                    a.setIdEmpresa(usuario.getCodempresa());
                    a.setDescripcion(txt_tmpanexo.getText().trim());
                    buscar_cliente.cargarTabla(a, null, 0);
                }
            }

            if (txt_idregconta == e.getSource()) {
                cbo_idtipodoc.requestFocus();
            }

            if (cbo_idtipodoc == e.getSource()) {
                txt_serie.requestFocus();
            }

            if (txt_serie == e.getSource()) {
                txt_preimpreso.requestFocus();
            }

            if (txt_preimpreso == e.getSource()) {
                txt_tmpanexo.requestFocus();
            }

            if (txt_tmpruc == e.getSource()) {
                ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).requestFocus();
            }

            if (cbo_idestado == e.getSource()) {
                if (tbl_documento.getRowCount() > 0) {
                    tbl_documento.setRowSelectionInterval(0, 0);
                    tbl_documento.requestFocus();
                } else {
                    btn_cancelar.requestFocus();
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