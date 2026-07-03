package com.softcommerce.views.uijdseleccionaalmacen;

import com.softcommerce.beans.Stock;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CuadroMensaje;
import com.softcommerce.general.controles.ItemObject;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.reglasnegocio.RnStock;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.Frame;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;

public class UiJDSeleccionaAlmacenImpl extends UiJDSeleccionaAlmacen {

    public UiJDSeleccionaAlmacenImpl(String item, String id_almacen, Frame arg0) {
        super(item, id_almacen, arg0);
    }
}
