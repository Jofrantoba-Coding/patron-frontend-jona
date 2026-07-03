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

    private java.net.URL path;
    private JDateChooser dcFecha;
    private JTextField txtTransportista;
    private JTextField txtTransportistaNum;
    private JTextField txtPlaca;
    private JTextField txtMarca;
    private JTextField txtConstancia;
    private JTextField txtPeso;
    private String idVehiculo;
    private JButton btnBuscarVehiculo;
    private Gif gif;
    private JList jlistTurno;
    private List<BeanTurno> listTurno;
    private Usuario usuario;
    private Frame frm;
    private BeanProgramacionReparto beanReparto;

    public UiRegisterProgReparto(Frame arg0, Usuario usuario, java.net.URL path, BeanProgramacionReparto beanReparto) {
        super(arg0, true);
        this.usuario = usuario;
        this.path = path;
        this.frm = arg0;
        this.beanReparto = beanReparto;
        inicialize();
        initListener();
    }

    private void inicialize() {
        try {
            gif = new Gif();
            JPanel pnlPrinc = new JPanel();
            //pnlPrinc.setLayout(new BorderLayout());
            pnlPrinc.setLayout(new GridBagLayout());
            GridBagConstraints gbc = new GridBagConstraints();
            gbc.gridx = 0;
            gbc.gridy = 0;
            gbc.anchor = GridBagConstraints.WEST;
            gbc.insets = new Insets(2, 2, 2, 2);
            this.getContentPane().add(pnlPrinc);
            //pnlPrinc.add(getPnlNorth(), BorderLayout.NORTH);
            //pnlPrinc.add(getPnlCenter(), BorderLayout.CENTER);
            gbc.gridwidth = 2;
            pnlPrinc.add(getPnlVehiculo(), gbc);
            gbc.gridwidth = 1;
            gbc.gridx = 0;
            gbc.gridy = 1;
            gbc.anchor = GridBagConstraints.NORTHWEST;
            pnlPrinc.add(getPnlDatos(), gbc);
            gbc.gridx = 1;
            pnlPrinc.add(getPnlTurno(), gbc);
            setMinimumSize(new Dimension(600, 300));
            setTitleName("Programacion de Reparto");
            this.pack();
            ComponentToolKit.centerComponentPosicion(this);
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private JPanel getPnlNorth() {
        JPanel pnl = new JPanel();
        //pnl.add(getPnlDatos(), BorderLayout.WEST);
        pnl.add(getPnlVehiculo(), BorderLayout.WEST);
        return pnl;
    }

    private JPanel getPnlCenter() throws Exception {
        try {
            JPanel pnl = new JPanel();
            pnl.add(getPnlDatos(), BorderLayout.WEST);
            pnl.add(getPnlTurno(), BorderLayout.CENTER);
            return pnl;
        } catch (Exception e) {
            throw e;
        }
    }

    private JPanel getPnlDatos() {
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

    private JPanel getPnlVehiculo() {
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

    private JPanel getPnlTurno() throws Exception {
        try {
            JPanel pnl = new JPanel();
            pnl.setLayout(new BorderLayout());
            Border border = BorderFactory.createTitledBorder(null, "Turnos", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
            pnl.setBorder(border);
            RnTurno logic = new RnTurno(path);
            listTurno = logic.listarTurno("A");
            //DefaultListModel<CheckListItem> modelo = new DefaultListModel<CheckListItem>();
            //jlistTurno = new JList(modelo);
            for (int i = 0; i < listTurno.size(); i++) {
                BeanTurno bean = (BeanTurno) listTurno.get(i);
                CheckListItem chk = new CheckListItem(bean.getHora() + ":" + bean.getMinuto() + " " + bean.getTipo());
                //modelo.addElement(chk);
            }
            jlistTurno.setCellRenderer(new CheckListRenderer());
            jlistTurno.setSelectionMode(
                    ListSelectionModel.SINGLE_SELECTION);
            JScrollPane scroll = new JScrollPane(jlistTurno);
            scroll.setSize(new Dimension(200, 150));
            pnl.add(scroll, BorderLayout.CENTER);
            return pnl;
        } catch (Exception e) {
            throw e;
        }
    }

    private void initListener() {
        btnBuscarVehiculo.addActionListener(this);
        jlistTurno.addMouseListener(this);
    }

    private void cargarVehiculo(BeanVehiculo bean) {
        idVehiculo = bean.getId_vehiculo();
        txtTransportista.setText(bean.getEmpresa());
        txtTransportistaNum.setText(bean.getNumerodoc());
        txtConstancia.setText(bean.getConstanciainscripcion());
        txtPlaca.setText(bean.getPlaca());
        txtPeso.setText(bean.getPeso().toString());
        txtMarca.setText(bean.getBeanMarcaVehiculo().getDescripcion() + "/" + bean.getBeanModeloVehiculo().getDescripcion());
    }

    private BeanProgramacionReparto getProgReparto() throws Exception {
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

    private String xmlTurno() {
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

    private void cargarProgTurno(int id_programacion) throws Exception {
        try {
            RnReparto logic = new RnReparto(path);
            List<BeanTurno> lista = logic.listProgrTurno(id_programacion);
            for (int i = 0; i < listTurno.size(); i++) {
                CheckListItem item = (CheckListItem) jlistTurno.getModel().getElementAt(i);
                item.setEnabled(false);
                item.setSelected(swTurno(lista, listTurno.get(i).getId_turno()));
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private boolean swTurno(List<BeanTurno> list, int id_turno) {
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
        boolean sw = false;
        for (int i = 0; i < listTurno.size(); i++) {
            CheckListItem item = (CheckListItem) jlistTurno.getModel().getElementAt(i);
            if (item.isSelected()) {
                sw = item.isSelected();
                break;
            }
        }
        if (!sw) {
            JOptionPane.showMessageDialog(this, "Seleccione al menos un turno");
            return false;
        }
        /*JTextField txt = new JTextField();
         txt_Descripcion.setBorder(txt.getBorder());
         if (txt_Descripcion.getText().trim().length() == 0) {
         JOptionPane.showMessageDialog(this, "Para " + namemode + ", debes especificar su Descripcion.", "Datos incompletos", JOptionPane.CANCEL_OPTION);
         txt_Descripcion.setBorder(new LineBorder(Color.RED));
         txt_Descripcion.requestFocus();
         return false;
         }*/
        return true;
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
        try {
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void newRegister() {
        //txt_Descripcion.requestFocus();
    }

    @Override
    public boolean loadRegister() {
        try {
            if (beanReparto != null) {
                dcFecha.setDate(beanReparto.getFecha());
                txtTransportista.setText(beanReparto.getBeanVehiculo().getEmpresa());
                txtTransportistaNum.setText(beanReparto.getBeanVehiculo().getNumerodoc());
                txtPlaca.setText(beanReparto.getBeanVehiculo().getPlaca());
                txtConstancia.setText(beanReparto.getBeanVehiculo().getConstanciainscripcion());
                txtPeso.setText(beanReparto.getPeso().toString());
                txtMarca.setText(beanReparto.getBeanVehiculo().getBeanMarcaVehiculo().getDescripcion() + "/" + beanReparto.getBeanVehiculo().getBeanModeloVehiculo().getDescripcion());
                cargarProgTurno(beanReparto.getId_programacion());
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
            return false;
        }
    }

    @Override
    public boolean loadRegister(Object o) {
        return true;
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
        if (btnBuscarVehiculo == comp) {
            cargarVehiculo((BeanVehiculo) valor);
        }
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
        try {
            BeanProgramacionReparto bean = getProgReparto();
            RnReparto logic = new RnReparto(path);
            return logic.insertProgReparto(bean, xmlTurno());
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public String executeUpdate() {
        try {
            /*RnClaseOperacion logic = new RnClaseOperacion(path);
             BeanClaseOperacion bean = new BeanClaseOperacion();
             BeanOrigenOperacion beanOrigen = new BeanOrigenOperacion();
             bean.setId_clase_operacion(txt_Codigo.getText());
             bean.setDescripcion(txt_Descripcion.getText().trim());
             beanOrigen.setId_origen_operacion(xOrigen.get(cboOrigen.getSelectedIndex()).getId_origen_operacion());
             bean.setBeanOrigenOperacion(beanOrigen);*/
            String rpta = "";
            //rpta = logic.mantClaseOperacion(bean, "A");
            return rpta;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public boolean executeDelete() {
        try {
            /*RnClaseOperacion logic = new RnClaseOperacion(path);
             BeanClaseOperacion bean = new BeanClaseOperacion();
             BeanOrigenOperacion beanOrigen = new BeanOrigenOperacion();
             bean.setId_clase_operacion(txt_Codigo.getText());
             bean.setDescripcion(txt_Descripcion.getText().trim());
             beanOrigen.setId_origen_operacion(xOrigen.get(cboOrigen.getSelectedIndex()).getId_origen_operacion());
             bean.setBeanOrigenOperacion(beanOrigen);
             String rpta = "";
             rpta = logic.mantClaseOperacion(bean, "E");*/
            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
            return false;
        }
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
