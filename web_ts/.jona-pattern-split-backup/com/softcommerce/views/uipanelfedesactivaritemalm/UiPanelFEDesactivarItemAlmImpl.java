package com.softcommerce.views.uipanelfedesactivaritemalm;

import com.softcommerce.beans.ConfiguracionItemAlmacen;
import com.softcommerce.formularios.*;
import com.softcommerce.general.tablas.DesactivarItemTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.logic.LogicDesactivarItem;
import com.softcommerce.util.render.CellRendererImageEstado;
import java.awt.Button;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.border.LineBorder;
import javax.swing.DefaultComboBoxModel;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JInternalFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.RowFilter;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableRowSorter;

public class UiPanelFEDesactivarItemAlmImpl extends UiPanelFEDesactivarItemAlm {

    public UiPanelFEDesactivarItemAlmImpl(final java.net.URL path) {
        super(path);
    }
}
