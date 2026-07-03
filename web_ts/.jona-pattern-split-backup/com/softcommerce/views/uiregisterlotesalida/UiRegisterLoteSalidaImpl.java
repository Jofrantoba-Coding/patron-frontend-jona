package com.softcommerce.views.uiregisterlotesalida;

import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.Lote;
import com.softcommerce.formularios.*;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.general.tablas.GuiaDevolucionProveedorTableModel;
import com.softcommerce.general.tablas.TableModelLoteSalida;
import com.softcommerce.iconos.Gif;
import com.softcommerce.logic.LogicLote;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.Font;
import java.math.BigDecimal;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.ListSelectionModel;
import javax.swing.table.AbstractTableModel;

public class UiRegisterLoteSalidaImpl extends UiRegisterLoteSalida {

    public UiRegisterLoteSalidaImpl(Main frame, URL path, ContaItem bean, BigDecimal cantidadBean, AbstractTableModel modelGeneric) {
        super(frame, path, bean, cantidadBean, modelGeneric);
    }
}
