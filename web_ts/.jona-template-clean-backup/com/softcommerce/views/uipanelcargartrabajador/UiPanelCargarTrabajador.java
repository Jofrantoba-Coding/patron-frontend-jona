/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipanelcargartrabajador;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Trabajador;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CDialog;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.CuadroMensaje;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.TrabajadorTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnTrabajador;
import java.awt.Color;
import java.awt.Component;
import java.awt.Font;
import java.awt.Frame;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.RowFilter;
import javax.swing.SwingConstants;
import javax.swing.border.EmptyBorder;
import javax.swing.table.TableRowSorter;

/**
 *
 * @author Team Develtrex
 */
public class UiPanelCargarTrabajador extends CDialog implements InterUiPanelCargarTrabajador, ActionListener, KeyListener, WindowListener, ItemListener, FocusListener, MouseListener, PropertyChangeListener {

    JHDialog arg;
    Usuario usuario;
    protected CuadroMensaje cuadro = null;
    JTextField txtNombres;
    JTextField txtDni;
    CTable tblTrabajador;
    TrabajadorTableModel mdlTrabajador;
    JButton btnAgregar;
    JButton btnCancelar;
    JTextField txtDireccion;
    public TableRowSorter<TrabajadorTableModel> modeloOrdenado;
    JButton btnBuscar;

    public UiPanelCargarTrabajador(Frame arg0, JHDialog arg, Usuario usuario, java.net.URL path) {
        super(arg0);
        this.path = path;
        this.arg = arg;
        this.usuario = usuario;
        cuadro = new CuadroMensaje(this.usuario);
        initialize();
    }

    public void cargarTabla() {
    }

    protected RowFilter<Object, Object> Filtrar() {
        List<RowFilter<Object, Object>> filtros = new ArrayList<RowFilter<Object, Object>>();
        if (txtNombres.getText().trim().length() > 0) {
            filtros.add(RowFilter.regexFilter(".*" + txtNombres.getText().trim() + ".*", 3));
        }
        if (txtDni.getText().trim().length() > 0) {
            filtros.add(RowFilter.regexFilter(".*" + txtDni.getText().trim() + ".*", 7));
        }
        if (txtDireccion.getText().trim().length() > 0) {
            filtros.add(RowFilter.regexFilter(".*" + txtDireccion.getText().trim() + ".*", 4));
        }

        RowFilter<Object, Object> filtro = RowFilter.andFilter(filtros);
        return filtro;

    }

    protected void initialize() {
        addWindowListener(this);
        Gif gif = new Gif();
        JPanel panelArriba = new JPanel();
        panelArriba.setSize(105, 20);
//        panelArriba.setLayout(layout);
        panelArriba.setLayout(new BoxLayout(panelArriba, BoxLayout.X_AXIS));
        JLabel lblTrabajador = new JLabel("Nombres");
        panelArriba.add(lblTrabajador);
        txtNombres = new JTextField();
        txtNombres.addKeyListener(this);
        txtNombres.setDocument(new UpperCaseNumberDocument(255));
        txtNombres.addFocusListener(this);
        txtNombres.setSize(90, 20);
        panelArriba.add(txtNombres);
        JLabel lblDni = new JLabel("DNI");
        panelArriba.add(lblDni);
        txtDni = new JTextField();
        txtDni.addActionListener(this);
        txtDni.addKeyListener(this);
        txtDni.addFocusListener(this);
        txtDni.setSize(30, 20);
        panelArriba.add(txtDni);
        JLabel lblDireccion = new JLabel("Direccion");
        panelArriba.add(lblDireccion);
        txtDireccion = new JTextField();
        txtDireccion.addKeyListener(this);
        txtDireccion.addFocusListener(this);
        txtDireccion.setSize(120, 20);
        panelArriba.add(txtDireccion);
        btnBuscar = new JButton("Buscar");
        btnBuscar.addActionListener(this);
        btnBuscar.addKeyListener(this);
        btnBuscar.setVisible(false);
        panelArriba.add(btnBuscar);

        JPanel panelCentro = new JPanel();
        GridLayout layout2 = new GridLayout(1, 1);
        panelCentro.setLayout(layout2);

//        tblTrabajador = new CTable();
//        mdlTrabajador = new TrabajadorTableModel();
//        modeloOrdenado = new TableRowSorter<TrabajadorTableModel>(mdlTrabajador);
//        tblTrabajador.setModel(mdlTrabajador);
//        tblTrabajador.setRowSorter(modeloOrdenado);                   
//        
//        JScrollPane scp_documento= new JScrollPane(tblTrabajador,JScrollPane.VERTICAL_SCROLLBAR_ALWAYS,JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS);
//        scp_documento.setBounds(5,30,855,285);

        ///
        mdlTrabajador = new TrabajadorTableModel();
        tblTrabajador = new CTable();
        tblTrabajador.setModel(mdlTrabajador);
        modeloOrdenado = new TableRowSorter<TrabajadorTableModel>(mdlTrabajador);
        tblTrabajador.setRowSorter(modeloOrdenado);
        tblTrabajador.setAllTableNoEditable();
        tblTrabajador.setAllColumnNoResizable();
        tblTrabajador.setAllColumnPreferredWidth();
        tblTrabajador.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
//            obtenerDatos();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);
        JScrollPane scp_documento = new JScrollPane(tblTrabajador, JScrollPane.VERTICAL_SCROLLBAR_ALWAYS, JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS);
        scp_documento.setBounds(5, 30, 855, 285);
        panelCentro.add(scp_documento);
        tblTrabajador.addKeyListener(this);

//        GridLayout layout3 = new GridLayout(1,2);
        JPanel panelAbajo = new JPanel();
//        panelAbajo.setLayout(layout3);


        btnAgregar = new JButton("Agregar", gif.ADD16);
        btnAgregar.addActionListener(this);
        btnAgregar.addKeyListener(this);
        btnAgregar = new JButton("Agregar", gif.ADD16);
        btnAgregar.setMnemonic('B');
        btnAgregar.setHorizontalAlignment(SwingConstants.LEFT);
        btnAgregar.setIconTextGap(10);
        btnAgregar.addActionListener(this);
        btnAgregar.setFont(new Font("Verdana", 1, 10));
        btnAgregar.setOpaque(false);
        btnAgregar.addKeyListener(this);
        btnAgregar.setFocusPainted(false);
        btnAgregar.setBounds(740, 325, 120, 25);

        panelAbajo.add(btnAgregar);

        btnCancelar = new JButton("Cancelar", gif.CANCEL16);
        btnCancelar.addActionListener(this);
        btnCancelar.addKeyListener(this);
        btnCancelar.setMnemonic('B');
        btnCancelar.setHorizontalAlignment(SwingConstants.LEFT);
        btnCancelar.setIconTextGap(10);
        btnCancelar.addActionListener(this);
        btnCancelar.setFont(new Font("Verdana", 1, 10));
        btnCancelar.setOpaque(false);
        btnCancelar.addKeyListener(this);
        btnCancelar.setFocusPainted(false);
        btnCancelar.setBounds(740, 325, 120, 25);
        panelAbajo.setLayout(new BoxLayout(panelAbajo, BoxLayout.X_AXIS));

        panelAbajo.add(btnCancelar);

        panelArriba.setOpaque(false);
        JTabbedPane tab = new JTabbedPane();
        tab.setBorder(new EmptyBorder(5, 5, 5, 5));
        tab.setBackground(new Color(243, 248, 252));
        JPanel pnlGeneral = new JPanel();
        pnlGeneral.setLayout(new BoxLayout(pnlGeneral, BoxLayout.Y_AXIS));
        pnlGeneral.add(panelArriba);
        pnlGeneral.add(panelCentro);
        pnlGeneral.add(panelAbajo);

        tblTrabajador.setNoVisibleColumn(2);
        tblTrabajador.setNoVisibleColumn(5);
        tblTrabajador.setNoVisibleColumn(6);
//        tblTrabajador.setNoVisibleColumn(7);
//        tblTrabajador.setNoVisibleColumn(8);
//        tblTrabajador.setNoVisibleColumn(9);
        tblTrabajador.setNoVisibleColumn(10);
        tblTrabajador.setNoVisibleColumn(11);
        tblTrabajador.setNoVisibleColumn(12);
        tblTrabajador.setNoVisibleColumn(13);
        tblTrabajador.setNoVisibleColumn(14);
        tblTrabajador.setNoVisibleColumn(15);
        tblTrabajador.setNoVisibleColumn(16);
        tblTrabajador.setNoVisibleColumn(17);
        tblTrabajador.setNoVisibleColumn(19);
        tblTrabajador.setNoVisibleColumn(20);
        tblTrabajador.setNoVisibleColumn(21);
        tblTrabajador.getColumnModel().getColumn(0).setPreferredWidth(40);
        tblTrabajador.getColumnModel().getColumn(1).setPreferredWidth(60);
        tblTrabajador.getColumnModel().getColumn(3).setPreferredWidth(220);
        tblTrabajador.getColumnModel().getColumn(2).setPreferredWidth(220);
        tblTrabajador.getColumnModel().getColumn(4).setPreferredWidth(70);
//        tblTrabajador.getColumnModel().getColumn(0).setPreferredWidth(40);
//        tblTrabajador.getColumnModel().getColumn(0).setPreferredWidth(40);
//        
//        Frmae 
//         frame.setLayout(new BoxLayout(frame.getContentPane(),BoxLayout.Y_AXIS));
//        frame.add(panelSuperior);
//        frame.add(panelInferior);
//        
        tab.add("Trabajador", pnlGeneral);
        setContentPane(tab);
        setModal(true);
        setResizable(false);
        setSize(890, 420);
        cargarTabla();


        ComponentToolKit.centerComponentPosicion(this);



    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        Trabajador trabajador = new Trabajador();
        /*
         * or.getNumero();
         case 3: return trabajador.getNombre();
         case 4: return trabajador.getDireccion();
         case 5: return trabajador.getSexo();
         case 6: return trabajador.getFechanac();
         case 7: return trabajador.getDni();
         case 8: return trabajador.getTelefono();
         case 9: return trabajador.getCelular();
         case 10: return trabajador.getEmail();
         case 11: return trabajador.getId_puntoventa();
         case 12: return trabajador.getEstado();
         case 13: return trabajador.getTipotrabajador();
         case 14: return trabajador.getId_empresa();
         case 15: return trabajador.getId_localidad();
         case 16: return trabajador.getEmpresa();
         case 17: return trabajador.getLocalidad();
         case 18: return trabajador.getPunto_venta();
         case 19: return trabajador.getDepartamento();
         case 20: return trabajador.getProvincia();
         case 21: return trabajador.getDistrito();
         */
        trabajador.setId_trabajador(mdlTrabajador.getValueAt(tblTrabajador.getSelectedRow(), 0).toString());
        trabajador.setNombre(mdlTrabajador.getValueAt(tblTrabajador.getSelectedRow(), 3).toString());
        trabajador.setDireccion(mdlTrabajador.getValueAt(tblTrabajador.getSelectedRow(), 0).toString());
        trabajador.setDni(mdlTrabajador.getValueAt(tblTrabajador.getSelectedRow(), 0).toString());
        int ind = Integer.parseInt(tblTrabajador.getValueRow(this.tblTrabajador.getSelectedRow(), 0).toString()) - 1;
        if (e.getSource() == btnAgregar) {
            arg.setValueSearch(mdlTrabajador.getTrabajador(ind), btnAgregar);
            this.dispose();
        }

        if (e.getSource() == btnCancelar) {
            dispose();
        }




    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    public void aplicarFiltro() {
        modeloOrdenado.setRowFilter(Filtrar());

        if (tblTrabajador.getRowCount() > 0) {
            tblTrabajador.setRowSelectionInterval(0, 0);
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txtNombres) {
                txtDni.requestFocus();
            }

            if (e.getSource() == txtDni) {
                txtDireccion.requestFocus();
            }

            if (e.getSource() == txtDireccion) {
                txtNombres.requestFocus();
            }
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txtNombres)
                    || (e.getSource() == txtDni)
                    || (e.getSource() == txtDireccion)) {
                aplicarFiltro();
            }
        }
    }

    @Override
    public void windowOpened(WindowEvent e) {
        txtNombres.requestFocus();
    }

    @Override
    public void windowClosing(WindowEvent e) {
        dispose();
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
    public void focusGained(FocusEvent e) {
    }

    @Override
    public void focusLost(FocusEvent e) {
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
    public void propertyChange(PropertyChangeEvent evt) {
    }
}
