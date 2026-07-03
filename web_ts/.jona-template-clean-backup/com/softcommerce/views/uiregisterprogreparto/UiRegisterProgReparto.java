/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiregisterprogreparto;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanProgramacionReparto;
import com.softcommerce.beans.BeanTurno;
import com.softcommerce.beans.BeanVehiculo;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnReparto;
import com.softcommerce.reglasnegocio.RnTurno;
import com.softcommerce.util.CheckListItem;
import com.softcommerce.util.render.CheckListRenderer;
import com.toedter.calendar.JDateChooser;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Frame;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.ListSelectionModel;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;

/**
 *
 * @author Team Develtrex
 */
public class UiRegisterProgReparto extends JHDialog implements InterUiRegisterProgReparto, ActionListener, MouseListener {

    protected java.net.URL path;
    protected JDateChooser dcFecha;
    protected JTextField txtTransportista;
    protected JTextField txtTransportistaNum;
    protected JTextField txtPlaca;
    protected JTextField txtMarca;
    protected JTextField txtConstancia;
    protected JTextField txtPeso;
    protected String idVehiculo;
    protected JButton btnBuscarVehiculo;
    protected Gif gif;
    protected JList jlistTurno;
    protected List<BeanTurno> listTurno;
    protected Usuario usuario;
    protected Frame frm;
    protected BeanProgramacionReparto beanReparto;

    public UiRegisterProgReparto(Frame arg0, Usuario usuario, java.net.URL path, BeanProgramacionReparto beanReparto) {
        super(arg0, true);
        this.usuario = usuario;
        this.path = path;
        this.frm = arg0;
        this.beanReparto = beanReparto;
        inicialize();
        initListener();
    }

    protected void inicialize() {
    }

    protected JPanel getPnlNorth() {
        JPanel pnl = new JPanel();
        //pnl.add(getPnlDatos(), BorderLayout.WEST);
        pnl.add(getPnlVehiculo(), BorderLayout.WEST);
        return pnl;
    }

    protected JPanel getPnlCenter() throws Exception {
        try {
            JPanel pnl = new JPanel();
            pnl.add(getPnlDatos(), BorderLayout.WEST);
            pnl.add(getPnlTurno(), BorderLayout.CENTER);
            return pnl;
        } catch (Exception e) {
            throw e;
        }
    }

    protected JPanel getPnlDatos() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnlPrinc.add(pnl, BorderLayout.NORTH);
        Border border = BorderFactory.createTitledBorder(null, "Datos Generales", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnl.setBorder(border);
        pnl.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;
        JLabel lblFecha = new JLabel("Fecha:");
        pnl.add(lblFecha, gbc);
        dcFecha = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dcFecha.setDate(new Date());
        gbc.gridx = 1;
        pnl.add(dcFecha, gbc);
        return pnlPrinc;
    }

    protected JPanel getPnlVehiculo() {
        JPanel pnl = new JPanel();
        Border border = BorderFactory.createTitledBorder(null, "Datos de Vehiculo", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnl.setBorder(border);
        pnl.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;
        JLabel lblTrans = new JLabel("R Social");
        pnl.add(lblTrans, gbc);
        gbc.gridx = 1;
        txtTransportista = new JTextField();
        txtTransportista.setColumns(25);
        txtTransportista.setEditable(false);
        gbc.gridwidth = 3;
        pnl.add(txtTransportista, gbc);
        gbc.gridwidth = 1;
        gbc.gridx = 4;
        JLabel lblNum = new JLabel("RUC/DNI");
        pnl.add(lblNum, gbc);
        gbc.gridx = 5;
        txtTransportistaNum = new JTextField();
        txtTransportistaNum.setColumns(8);
        txtTransportistaNum.setEditable(false);
        pnl.add(txtTransportistaNum, gbc);
        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblConstancia = new JLabel("Const Inscrip");
        pnl.add(lblConstancia, gbc);
        gbc.gridx = 1;
        txtConstancia = new JTextField();
        txtConstancia.setColumns(8);
        txtConstancia.setEditable(false);
        pnl.add(txtConstancia, gbc);

        gbc.gridx = 2;
        JLabel lblPeso = new JLabel("Peso");
        pnl.add(lblPeso, gbc);
        gbc.gridx = 3;
        txtPeso = new JTextField();
        txtPeso.setColumns(7);
        txtPeso.setEditable(false);
        txtPeso.setText("0");
        pnl.add(txtPeso, gbc);

        gbc.gridx = 4;
        JLabel lblPlaca = new JLabel("Placa");
        pnl.add(lblPlaca, gbc);
        gbc.gridx = 5;
        txtPlaca = new JTextField();
        txtPlaca.setColumns(8);
        txtPlaca.setEditable(false);
        pnl.add(txtPlaca, gbc);
        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblMarca = new JLabel("Marca/Modelo");
        pnl.add(lblMarca, gbc);
        gbc.gridx = 1;
        txtMarca = new JTextField();
        txtMarca.setColumns(25);
        txtMarca.setEditable(false);
        gbc.gridwidth = 3;
        pnl.add(txtMarca, gbc);
        gbc.gridwidth = 1;
        gbc.gridx = 4;
        btnBuscarVehiculo = new JButton(gif.SEARCH16);
        btnBuscarVehiculo.setToolTipText("Buscar Vehiculo");
        pnl.add(btnBuscarVehiculo, gbc);
        return pnl;
    }

    protected JPanel getPnlTurno() throws Exception {
        return null;
    }

    protected void initListener() {
        btnBuscarVehiculo.addActionListener(this);
        jlistTurno.addMouseListener(this);
    }

    protected void cargarVehiculo(BeanVehiculo bean) {
    }

    protected BeanProgramacionReparto getProgReparto() throws Exception {
        try {
            BeanProgramacionReparto bean = new BeanProgramacionReparto();
            bean.setFecha(dcFecha.getDate());
            BeanVehiculo beanVehiculo = new BeanVehiculo();
            beanVehiculo.setId_vehiculo(idVehiculo);
            bean.setBeanVehiculo(beanVehiculo);
            bean.setPeso(new BigDecimal(txtPeso.getText()));
            bean.setId_usuario(usuario.getId_usuario());
            String hora = "";
            for (int i = 0; i < listTurno.size(); i++) {
                CheckListItem item = (CheckListItem) jlistTurno.getModel().getElementAt(i);
                if (item.isSelected()) {
                    hora = listTurno.get(i).getHora() + ":" + listTurno.get(i).getMinuto() + " " + listTurno.get(i).getTipo();
                    break;
                }
            }
            bean.setHora(hora);
            return bean;
        } catch (Exception e) {
            throw e;
        }
    }

    protected String xmlTurno() {
        String xmlTurno = "";
        xmlTurno = "<?xml version=\"1.0\" ?> ";
        xmlTurno += "<TURNOS>";
        for (int i = 0; i < listTurno.size(); i++) {
            CheckListItem item = (CheckListItem) jlistTurno.getModel().getElementAt(i);
            if (item.isSelected()) {
                xmlTurno += "<TURNO>";
                xmlTurno += "<ID_TURNO>" + listTurno.get(i).getId_turno() + "</ID_TURNO>";
                xmlTurno += "<HORA>" + listTurno.get(i).getHora() + ":" + listTurno.get(i).getMinuto() + " " + listTurno.get(i).getTipo() + "</HORA>";
                xmlTurno += "</TURNO>";
            }
        }
        xmlTurno += "</TURNOS>";
        return xmlTurno;
    }

    protected void cargarProgTurno(int id_programacion) throws Exception {
    }

    protected boolean swTurno(List<BeanTurno> list, int id_turno) {
        boolean sw = false;
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i).getId_turno() == id_turno) {
                sw = true;
                break;
            }
        }
        return sw;
    }

    @Override
    public boolean isRegisterValid() {
        return false;
    }

    @Override
    public void showMessagePrint(String codigo) {
    }

    @Override
    public void setRegisterEnabled(boolean flag) {
        btnBuscarVehiculo.setEnabled(flag);
        dcFecha.setEnabled(flag);
        jlistTurno.setEnabled(flag);
    }

    @Override
    public void setRegisterEditable(boolean flag) {
    }

    @Override
    public void loadCombo() {
    }

    @Override
    public void newRegister() {
    }

    @Override
    public boolean loadRegister() {
        return false;
    }

    @Override
    public boolean loadRegister(Object o) {
        return false;
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void showMessageSuccessfulInsert() {
    }

    @Override
    public void showMessageSuccessfulUpdate() {
    }

    @Override
    public void showMessageSuccessfulDelete() {
    }

    @Override
    public void showMessageErrorDelete() {
    }

    @Override
    public void showMessageErrorUpdate() {
    }

    @Override
    public void showMessageErrorInsert() {
    }

    @Override
    public String executeInsert() {
        return null;
    }

    @Override
    public String executeUpdate() {
        return null;
    }

    @Override
    public boolean executeDelete() {
        return false;
    }

    @Override
    public boolean executeAnular() {
        return false;
    }

    @Override
    public boolean executeSelect() {
        return false;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource().equals(btnBuscarVehiculo)) {
            FormBuscarVehiculo objBuscar = new FormBuscarVehiculo(frm, this, path, btnBuscarVehiculo, usuario);
            objBuscar.setRucFiltro(usuario.getRuc());
            objBuscar.setVisible(true);
        }

    }

    @Override
    public void mouseClicked(MouseEvent e) {
        if (e.getSource().equals(jlistTurno)) {
            int index = jlistTurno.locationToIndex(e.getPoint());
            CheckListItem item = (CheckListItem) jlistTurno.getModel().getElementAt(index);
            if (item.isEnabled()) {
                item.setSelected(!item.isSelected());
                jlistTurno.repaint(jlistTurno.getCellBounds(index, index));
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
