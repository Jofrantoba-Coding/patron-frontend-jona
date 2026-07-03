/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uibuscarsolicitudtransferencia;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.Usuario;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import com.softcommerce.general.controles.CDialog;
import com.softcommerce.general.controles.JHInternal;
import java.beans.PropertyChangeEvent;
import com.softcommerce.general.tablas.TableModelBuscarSolicitudTransferencia;
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
import com.softcommerce.general.controles.CuadroMensaje;
import com.softcommerce.general.controles.IntegerDocument;
import java.awt.event.FocusListener;
import java.awt.event.ItemListener;
import java.awt.event.MouseListener;
import java.beans.PropertyChangeListener;
import java.util.Date;
import javax.swing.JComponent;
import javax.swing.KeyStroke;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.util.FormatObject;
import java.util.List;
import javax.swing.JOptionPane;

public class UiBuscarSolicitudTransferencia extends CDialog implements InterUiBuscarSolicitudTransferencia, ActionListener, KeyListener, WindowListener, ItemListener, FocusListener, MouseListener, PropertyChangeListener {

    private static final long serialVersionUID = 1L;
    private JTabbedPane tabb_documento;
    private TableModelBuscarSolicitudTransferencia mdl_documento;
    private CTable tbl_documento;
    private JButton btn_agregar;
    private JButton btn_cancelar;
    private JButton btn_buscar;
    private JButton btn_nuevo;
    private JComboBox cbo_idestado;
    private JDateChooser dc_fechainicio;
    private JDateChooser dc_fechafin;
    private JTextField txt_serie;
    private JTextField txt_preimpreso;
    private JTextField txt_idregconta;
    private JHInternal arg;
    private Component comp;
    private Usuario usuario;
    private CuadroMensaje cuadro = null;
    private Gif gif;

    public UiBuscarSolicitudTransferencia(Frame arg0, JHInternal arg, Usuario usuario, java.net.URL path) {
        super(arg0);
        this.path = path;
        this.arg = arg;
        this.usuario = usuario;
        cuadro = new CuadroMensaje(this.usuario);
        initialize();
    }

    private void initialize() {
        addWindowListener(this);

        gif = new Gif();

        JPanel pnl = new JPanel();
        pnl.setBackground(new Color(243, 248, 252));
        pnl.setOpaque(false);
        pnl.setLayout(null);

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

        JLabel lblSerie = new JLabel("N° Solicitud");
        lblSerie.setBounds(160, 5, 90, 20);
        pnl.add(lblSerie);

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

        dc_fechainicio = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).addFocusListener(this);
        dc_fechainicio.setBounds(410, 5, 90, 20);
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

        JLabel lblFechaInicio = new JLabel("F Inicio");
        lblFechaInicio.setDisplayedMnemonic('c');
        lblFechaInicio.setLabelFor(dc_fechainicio);
        lblFechaInicio.setBounds(370, 5, 40, 20);
        pnl.add(lblFechaInicio);

        dc_fechafin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).addFocusListener(this);
        dc_fechafin.setBounds(540, 5, 90, 20);
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

        JLabel lblFechaFin = new JLabel("F Fin");
        lblFechaFin.setBounds(510, 5, 30, 20);
        lblFechaFin.setDisplayedMnemonic('a');
        lblFechaFin.setLabelFor(dc_fechafin);
        pnl.add(lblFechaFin);

        JLabel lbl_familia = new JLabel("Est");
        lbl_familia.setFont(new Font("Verdana", 0, 11));
        lbl_familia.setBounds(640, 5, 30, 20);
        pnl.add(lbl_familia);

        cbo_idestado = new JComboBox();
        cbo_idestado.setBounds(670, 5, 50, 20);
        cbo_idestado.addItem("T");
        cbo_idestado.addItem("PAA");
        cbo_idestado.addItem("PEN");
        cbo_idestado.addActionListener(this);
        cbo_idestado.addKeyListener(this);
        pnl.add(cbo_idestado);

        btn_nuevo = new JButton(gif.NEW16);
        btn_nuevo.setBounds(730, 5, 40, 20);
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

        //pnl.add(this.btn_buscar);
        pnl.add(getBtn_buscar());

        mdl_documento = new TableModelBuscarSolicitudTransferencia();
        tbl_documento = new CTable();
        tbl_documento.setModel(mdl_documento);
        tbl_documento.setAllTableNoEditable();
        tbl_documento.setAllColumnNoResizable();
        tbl_documento.setAllColumnPreferredWidth();
        tbl_documento.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                obtenerDatos();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);
        JScrollPane scp_documento = new JScrollPane(tbl_documento, JScrollPane.VERTICAL_SCROLLBAR_ALWAYS, JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS);
        scp_documento.setBounds(5, 30, 855, 285);
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

        setBackground(new Color(245, 245, 245));
        setTitle("Buscar Solicitud de Transferencia - UiBuscarSolicitudTransferencia");
        setContentPane(tabb_documento);
        setModal(true);
        setResizable(false);
        setSize(890, 420);
        ComponentToolKit.centerComponentPosicion(this);
    }

    public void limpiar() {
        txt_idregconta.setText("");
        txt_serie.setText("");
        txt_preimpreso.setText("");
        dc_fechainicio.setDate(DateTime.format(100, 0, 1));
        dc_fechafin.setDate(new Date());
        cbo_idestado.setSelectedIndex(0);
    }

    public void cargarTabla(Component ls_comp) {
        limpiar();
        this.comp = ls_comp;
        ComponentToolKit.centerComponentPosicion(this);
        txt_preimpreso.requestFocus();
        setVisible(true);
    }

    public void cargarTabla() {
        try {
            ContaCab m = new ContaCab();
            m.setIdEmpresa(usuario.getCodempresa());
            m.setIdLocalidad(usuario.getCodlocalidad());
            m.setIdPuntoventa(usuario.getCodpuntoventa());
            m.setFInicial(dc_fechainicio.getDate());
            m.setFFinal(dc_fechafin.getDate());
            m.setRcIdregconta(txt_idregconta.getText().trim());
            m.setSerie(txt_serie.getText().trim());
            m.setPreimpreso(txt_preimpreso.getText().trim());
            m.setIdEstado(cbo_idestado.getSelectedItem().equals("T") ? "" : (cbo_idestado.getSelectedItem().equals("PEN") ? "003" : (cbo_idestado.getSelectedItem().equals("PAA") ? "004" : "")));
            m.setIdPuntoventa(usuario.getCodpuntoventa());

            RnRegContaCab regla = new RnRegContaCab(path);
            mdl_documento.clearTable();
            //List<ContaCab> lista = regla.listarBuscarSolicitudTransferencia(m);
            List<ContaCab> lista = regla.listarBuscarSolicitudTransferencia(txt_idregconta.getText().trim(), txt_serie.getText().trim(), txt_preimpreso.getText().trim(), usuario.getCodpuntoventa());
            if (lista.size() > 0) {
                mdl_documento.agregarVectorMovInventarioCab(lista);
            } else {
                cuadro.CuadroAviso("No se encontraron documentos", JOptionPane.WARNING_MESSAGE);
            }
            tbl_documento.setAllColumnPreferredWidth();
        } catch (Exception ex) {
            //cuadro.CuadroAviso("Error al cargar datos: " + ex.getMessage(), JOptionPane.ERROR_MESSAGE);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }

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
        if (e.getSource() == dc_fechainicio.getCalendarButton()) {
            dc_fechainicio.setSelectableDateRange(DateTime.format(100, 0, 1), dc_fechafin.getDate());
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
            if (txt_idregconta == e.getSource()) {
                txt_serie.requestFocus();
            }

            if (txt_serie == e.getSource()) {
                txt_preimpreso.requestFocus();
            }

            if (txt_preimpreso == e.getSource()) {
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
        int row = tbl_documento.getSelectedRow();

        if (row >= 0) {
            if (arg != null) {
                ContaCab bean = mdl_documento.getMovInventarioCab(row);
                //arg.setValueSearch(tbl_documento.getValueAt(row, 0).toString().trim(), comp);
                arg.setValueSearch(bean, comp);
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

    private JButton getBtn_buscar() {
        if (btn_buscar == null) {
            btn_buscar = new JButton(gif.SEARCH16);
            btn_buscar.setBounds(775, 5, 40, 20);
            btn_buscar.setMnemonic('B');
            btn_buscar.setFont(new Font(Font.SANS_SERIF, 0, 9));
            btn_buscar.setOpaque(false);
            btn_buscar.setIconTextGap(10);
            btn_buscar.setToolTipText("Buscar Documento");
            btn_buscar.setContentAreaFilled(true);
            btn_buscar.setBorderPainted(true);
            btn_buscar.setFocusable(true);
            btn_buscar.setFocusPainted(false);
            btn_buscar.addActionListener(new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent e) {
                    cargarTabla();
                }
            });
            btn_buscar.registerKeyboardAction(new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent e) {
                }
            }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        }

        return btn_buscar;
    }
}