package com.softcommerce.views.uipaneltfalmacen;

import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.tablas.AlmacenTableModel;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.util.ExportExcel;
import com.softcommerce.util.render.CellRender;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.border.LineBorder;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.RowFilter;
import javax.swing.table.TableRowSorter;

public class UiPanelTFAlmacenImpl extends UiPanelTFAlmacen {

    public UiPanelTFAlmacenImpl(String title, JFrame frame, Usuario usuario) {
        super(title, frame, usuario);
    }

    public UiPanelTFAlmacenImpl(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, frame, usuario, vPermiso);
    }
}
