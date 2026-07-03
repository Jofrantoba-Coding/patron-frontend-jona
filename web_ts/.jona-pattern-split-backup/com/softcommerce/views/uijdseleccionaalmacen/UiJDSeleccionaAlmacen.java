package com.softcommerce.views.uijdseleccionaalmacen;


import com.softcommerce.formularios.*;
import java.util.List;

import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JComboBox;
import javax.swing.JButton;
import javax.swing.JOptionPane;

import com.softcommerce.beans.Stock;
import com.softcommerce.general.controles.CuadroMensaje;
import com.softcommerce.general.controles.ItemObject;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.reglasnegocio.RnStock;
import java.awt.Frame;
import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;

public class UiJDSeleccionaAlmacen extends JDialog  implements InterUiJDSeleccionaAlmacen {

    /**
     *
     */
    private static final long serialVersionUID = 1L;
    private JLabel lblAlmacen;
    private JComboBox cboAlmacen;
    private JButton btnCambiarAlmacen;
    private CuadroMensaje cuadro;
    private boolean swAceptar = false;
    private String id_Item = "";
    private String id_almacen;

    /**
     * Create the dialog.
     */
    public UiJDSeleccionaAlmacen(String item, String id_almacen, Frame arg0) {
        super(arg0);
        setModal(true);
        id_Item = item;
        this.id_almacen = id_almacen;
        cuadro = new CuadroMensaje();
        setTitle("Cambiar Almacen");
        setBounds(100, 100, 287, 113);
        setLocationRelativeTo(null);
        //setDefaultCloseOperation(JFrame.HIDE_ON_CLOSE);		
        getContentPane().setLayout(null);
        getContentPane().add(getLblAlmacen());
        getContentPane().add(getCboAlmacen());
        getContentPane().add(getBtnCambiarAlmacen());
        CargaAlmacenes();
        seleccionarAlmacen();
    }

    private JLabel getLblAlmacen() {
        if (lblAlmacen == null) {
            lblAlmacen = new JLabel("Almacen:");
            lblAlmacen.setBounds(10, 11, 60, 22);
        }
        return lblAlmacen;
    }

    private JComboBox getCboAlmacen() {
        if (cboAlmacen == null) {
            cboAlmacen = new JComboBox();
            cboAlmacen.setBounds(80, 11, 180, 22);
            CargaAlmacenes();
        }
        return cboAlmacen;
    }

    private JButton getBtnCambiarAlmacen() {
        if (btnCambiarAlmacen == null) {
            btnCambiarAlmacen = new JButton("Cambiar Almacen");
            btnCambiarAlmacen.addActionListener(new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent arg0) {
                    swAceptar = true;
                    setVisible(false);
                }
            });
            btnCambiarAlmacen.setBounds(140, 43, 120, 22);
        }
        return btnCambiarAlmacen;
    }

    private void CargaAlmacenes() {
        try {
            RnStock regla_Almacen = new RnStock(ConexionBaseDatos.getPath());
            Stock a = new Stock();
            a.setIdEmpresa("002");
            a.setIdPuntoVenta("");
            a.setFechainicio(DateTime.format(1901, 0, 1));
            a.setFechafin(DateTime.format(1901, 0, 1));
            a.setCantFisica(-1);
            a.setIdItem(id_Item);
            a.setTipoConsulta("2");

            List<Stock> Lista = regla_Almacen.listarInventarioStock(a);
            for (int i = 0; i < Lista.size(); i++) {
                boolean repite = false;
                if (getCboAlmacen().getItemCount() > 0) {
                    for (int j = 0; j < getCboAlmacen().getItemCount(); j++) {
                        if (Lista.get(i).getIdAlmacen().equals(((ItemObject) getCboAlmacen().getItemAt(j)).getId()) == true) {
                            repite = true;
                        }
                    }
                    if (repite == false) {
                        getCboAlmacen().addItem(new ItemObject(Lista.get(i).getIdAlmacen(), Lista.get(i).getAlmacen()));
                    }
                } else {
                    getCboAlmacen().addItem(new ItemObject(Lista.get(i).getIdAlmacen(), Lista.get(i).getAlmacen()));
                }
            }
        } catch (Exception ex) {
            cuadro.CuadroAviso("Error al cargar los almacenes", JOptionPane.WARNING_MESSAGE);
        }
    }

    private void seleccionarAlmacen() {
        for (int j = 0; j < cboAlmacen.getItemCount(); j++) {
            if (id_almacen.equals(((ItemObject) getCboAlmacen().getItemAt(j)).getId())) {
                cboAlmacen.setSelectedIndex(j);
            }
        }
    }

    //public String getAlmacen() {
    public ItemObject getAlmacen() {
        if (getCboAlmacen().getItemCount() > 0) {
            ItemObject it = (ItemObject) getCboAlmacen().getSelectedItem();
            //return it.getId();
            return it;
        }
        return null;
    }

    public boolean getSwAceptar() {
        return swAceptar;
    }
}
