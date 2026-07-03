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
    protected JLabel lblAlmacen;
    protected JComboBox cboAlmacen;
    protected JButton btnCambiarAlmacen;
    protected CuadroMensaje cuadro;
    protected boolean swAceptar = false;
    protected String id_Item = "";
    protected String id_almacen;

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

    protected JLabel getLblAlmacen() {
        if (lblAlmacen == null) {
            lblAlmacen = new JLabel("Almacen:");
            lblAlmacen.setBounds(10, 11, 60, 22);
        }
        return lblAlmacen;
    }

    protected JComboBox getCboAlmacen() {
        if (cboAlmacen == null) {
            cboAlmacen = new JComboBox();
            cboAlmacen.setBounds(80, 11, 180, 22);
            CargaAlmacenes();
        }
        return cboAlmacen;
    }

    protected JButton getBtnCambiarAlmacen() {
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

    protected void CargaAlmacenes() {
    }

    protected void seleccionarAlmacen() {
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
