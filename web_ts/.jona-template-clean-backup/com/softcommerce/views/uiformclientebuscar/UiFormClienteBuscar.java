/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiformclientebuscar;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanCliente;
import com.softcommerce.beans.ClienteSustituto;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.ClienteTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnCliente;
import java.awt.BorderLayout;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
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
import java.util.ArrayList;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.RowFilter;
import javax.swing.SwingConstants;
import javax.swing.table.TableRowSorter;

/**
 *
 * @author Team Develtrex
 */
public class UiFormClienteBuscar extends JDialog implements InterUiFormClienteBuscar, ActionListener, KeyListener, WindowListener, ItemListener, FocusListener, MouseListener {

    protected JHDialog dialog;
    protected Component comp;
    protected java.net.URL path;
    protected JPanel pnlContenedor;
    protected JPanel pnlBuscar;
    protected JPanel pnlTable;
    protected JTextField txtCodigo;
    protected JTextField txtDescripcion;
    protected JTextField txtNumero;
    public CTable tableCliente;
    public ClienteTableModel modeltableCliente;
    public TableRowSorter modeloOrdenadoCliente;
    protected JScrollPane scrollCliente;
    protected JButton btnAgregar;
    protected JButton btnCancelar;

    public UiFormClienteBuscar(JHDialog arg0, java.net.URL path, Component comp) {
        super(arg0);
        this.dialog = arg0;
        this.comp = comp;
        this.path = path;
        initComponents();
        initStyle();
        initListener();
        this.pack();
        //this.setVisible(true);
    }

    protected void initComponents() {
        setTitle("Buscar Cliente");
        pnlContenedor = new JPanel();
        pnlContenedor.setLayout(new BorderLayout(0, 0));

        pnlBuscar = new JPanel();
        pnlTable = new JPanel();
        pnlBuscar.setLayout(null);
        pnlTable.setLayout(null);
        //pnlTable.setLayout(new BorderLayout());
        //this.pnlTable.setLayout(new GridBagLayout());
        //GridBagConstraints gbc = new GridBagConstraints();

        JLabel lblCodigo = new JLabel("Codigo");
        lblCodigo.setBounds(20, 10, 40, 20);
        lblCodigo.setFont(new Font("Verdana", 0, 11));
        this.pnlBuscar.add(lblCodigo);

        txtCodigo = new JTextField();
        txtCodigo.setDocument(new IntegerDocument(10));
        txtCodigo.setBounds(70, 10, 100, 20);
        txtCodigo.setFont(new Font("Verdana", 0, 11));
        this.pnlBuscar.add(txtCodigo);

        JLabel lblDescripcion = new JLabel("Desc.");
        lblDescripcion.setBounds(180, 10, 40, 20);
        lblDescripcion.setFont(new Font("Verdana", 0, 11));
        this.pnlBuscar.add(lblDescripcion);

        txtDescripcion = new JTextField();
        txtDescripcion.setDocument(new UpperCaseNumberDocument(100));
        txtDescripcion.setBounds(230, 10, 200, 20);
        txtDescripcion.setFont(new Font("Verdana", 0, 11));
        this.pnlBuscar.add(txtDescripcion);

        JLabel lblNumero = new JLabel("RUC/DNI");
        lblNumero.setBounds(460, 10, 70, 20);
        lblNumero.setFont(new Font("Verdana", 0, 11));
        this.pnlBuscar.add(lblNumero);

        txtNumero = new JTextField();
        txtNumero.setDocument(new IntegerDocument(11));
        txtNumero.setBounds(540, 10, 100, 20);
        txtNumero.setFont(new Font("Verdana", 0, 11));
        this.pnlBuscar.add(txtNumero);

        modeltableCliente = new ClienteTableModel();
        modeloOrdenadoCliente = new TableRowSorter(modeltableCliente);
        tableCliente = new CTable();
        tableCliente.setRowSorter(modeloOrdenadoCliente);
        tableCliente.setModel(modeltableCliente);
        tableCliente.addMouseListener(this);
        tableCliente.setAllTableNoEditable();
        tableCliente.setAllColumnNoResizable();
        tableCliente.setRendererColumnZero();
        tableCliente.setAllColumnPreferredWidth();
        //tableCliente.setNoVisibleColumn(0);
        tableCliente.setNoVisibleColumn(2);
        tableCliente.setNoVisibleColumn(4);
        tableCliente.setNoVisibleColumn(5);
        tableCliente.setNoVisibleColumn(6);
        tableCliente.setNoVisibleColumn(7);
        tableCliente.setNoVisibleColumn(8);
        tableCliente.setColumnMinWidth(2, 350);
        tableCliente.setColumnMaxWidth(2, 350);
        tableCliente.setColumnMinWidth(4, 350);
        tableCliente.setColumnMaxWidth(4, 350);
        //tableCliente.getSelectionModel().addListSelectionListener(this);
        //scrollCliente = new JScrollPane(tableCliente,JScrollPane.VERTICAL_SCROLLBAR_ALWAYS,JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS);
        scrollCliente = new JScrollPane(tableCliente);
        scrollCliente.setPreferredSize(new Dimension(900, 350));
        scrollCliente.setBounds(20, 10, 855, 350);
        this.pnlTable.add(scrollCliente);

        Gif gif = new Gif();

        btnAgregar = new JButton("Agregar", gif.ADD16);
        btnAgregar.setMnemonic('A');
        btnAgregar.setHorizontalAlignment(SwingConstants.LEFT);
        btnAgregar.setIconTextGap(10);
        btnAgregar.setFont(new Font("Verdana", 1, 10));
        btnAgregar.setOpaque(false);
        btnAgregar.setBounds(740, 380, 120, 25);
        pnlTable.add(btnAgregar);

        btnCancelar = new JButton("Cancelar", gif.CANCEL16);
        btnCancelar.setMnemonic('C');
        btnCancelar.setHorizontalAlignment(SwingConstants.LEFT);
        btnCancelar.setIconTextGap(10);
        btnCancelar.setFont(new Font("Verdana", 1, 10));
        btnCancelar.setOpaque(false);
        btnCancelar.setBounds(30, 380, 120, 25);
        pnlTable.add(btnCancelar);

        pnlBuscar.setPreferredSize(new Dimension(915, 40));
        pnlTable.setPreferredSize(new Dimension(915, 355));
        pnlContenedor.add(pnlBuscar, BorderLayout.NORTH);
        pnlContenedor.setPreferredSize(new Dimension(915, 475));
        pnlContenedor.add(pnlTable, BorderLayout.CENTER);
        //this.setLayout(new BorderLayout());
        setSize(915, 475);
        this.getContentPane().add(pnlContenedor);
        this.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        //this.setMinimumSize(new Dimension(250,150));
        setSize(915, 475);
        setResizable(false);
        ComponentToolKit.centerComponentPosicion(this);
        setModal(true);

    }

    protected void initStyle() {

    }

    protected void initListener() {
        txtCodigo.addKeyListener(this);
        txtDescripcion.addKeyListener(this);
        txtNumero.addKeyListener(this);
        txtCodigo.addFocusListener(this);
        txtDescripcion.addFocusListener(this);
        txtNumero.addFocusListener(this);
        btnAgregar.addActionListener(this);
        btnCancelar.addActionListener(this);
    }

    public void cargarDatos() {
    }

    protected RowFilter getFilter() {
        return null;
    }

    protected void filtrar() {
    }

    protected void obtenerDatos() {
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == btnAgregar) {
            obtenerDatos();
        }
        if (e.getSource() == btnCancelar) {
            dispose();
        }
    }

    @Override
    public void keyTyped(KeyEvent e) {
        //throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txtCodigo) {
                txtDescripcion.requestFocus();
            }
            if (e.getSource() == txtDescripcion) {
                txtNumero.requestFocus();
            }
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txtDescripcion) || (e.getSource() == txtCodigo) || (e.getSource() == txtNumero)) {
                filtrar();
            }
        }
    }

    @Override
    public void windowOpened(WindowEvent e) {
        //throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void windowClosing(WindowEvent e) {
        //throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void windowClosed(WindowEvent e) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void windowIconified(WindowEvent e) {
        //throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void windowDeiconified(WindowEvent e) {
        //throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void windowActivated(WindowEvent e) {
        //throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void windowDeactivated(WindowEvent e) {
        //throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txtCodigo) {
            txtCodigo.selectAll();
        }
        if (e.getSource() == txtDescripcion) {
            txtDescripcion.selectAll();
        }
        if (e.getSource() == txtNumero) {
            txtNumero.selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txtCodigo && txtCodigo.getText().trim().length() > 0) {
            String serie = "0000000000" + txtCodigo.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txtCodigo.setText(nuevaserie);

            filtrar();
        }
    }

    @Override
    public void mouseClicked(MouseEvent e) {
        if (e.getSource() == tableCliente) {
            if (e.getClickCount() == 2) {
                obtenerDatos();
            }
        }
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
